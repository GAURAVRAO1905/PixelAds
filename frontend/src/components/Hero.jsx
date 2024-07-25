import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetCampaignsByUserQuery, useGetKeyQuery, useCheckoutMutation, usePaymentVerificationMutation } from '../slices/campaignApiSlice';
import Loader from './Loader';
import PendingCampaigns from './PendingCampaigns';
import PaidCampaigns from './PaidCampaigns';
import NotLoggedIn from './NotLoggedIn';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: campaigns, error: campaignsError, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useGetCampaignsByUserQuery();
  const { data: keyData, error: keyError, isLoading: isLoadingKey } = useGetKeyQuery();
  const [checkOut, { isLoading: isLoadingCheckout }] = useCheckoutMutation();
  const [paymentVerification] = usePaymentVerificationMutation();
  const [key, setKey] = useState('pending');
  const [filteredCampaigns, setFilteredCampaigns] = useState({ pendingCampaigns: [], paidCampaigns: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (campaigns) {
      const pendingCampaigns = campaigns.filter(campaign => campaign.paymentStatus === 'pending');
      const paidCampaigns = campaigns.filter(campaign => campaign.paymentStatus === 'paid');
      
      setFilteredCampaigns({ pendingCampaigns, paidCampaigns });
    }
  }, [campaigns]);

  const checkoutHandler = async (campaignId, amount) => {
    try {
      if (!keyData) {
        throw new Error('API key not available');
      }

      const { key } = keyData;

      const response = await checkOut({ amount }).unwrap();
      if (response.error) {
        throw new Error(response.error.message || 'Checkout failed');
      }

      const { order } = response;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Campaign Payment",
        order_id: order.id,
        handler: async function (response) {
          const data = {
            campaignId,
            orderCreationId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await paymentVerification(data).unwrap();

          if (result.success) {
            if (userInfo) {
              navigate(`/paymentsuccess?reference=${result.reference}`);
            } else {
              console.error('User is not authenticated');
            }
          } else {
            console.error('Payment verification failed:', result.error);
          }
        },
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email,
          contact: "9999999999"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout form closed');
            alert('Payment process cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error in checkoutHandler:', error.message);
    }
  };

  return (
    <div className='py-5'>
      <Container className='d-flex flex-column align-items-center'>
        {userInfo ? (
          <>
            {isLoadingCampaigns ? (
              <Loader />
            ) : campaignsError ? (
              <p>Alert: {campaignsError?.data?.message || campaignsError?.message || 'Unknown error'}</p>
            ) : (
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="pending" title="Pending">
                  {filteredCampaigns.pendingCampaigns.length > 0 ? (
                    <PendingCampaigns
                      campaigns={filteredCampaigns.pendingCampaigns}
                      isLoadingKey={isLoadingKey}
                      isLoadingCheckout={isLoadingCheckout}
                      keyError={keyError}
                      checkoutHandler={checkoutHandler}
                    />
                  ) : (
                    <p>No pending campaigns.</p>
                  )}
                </Tab>
                <Tab eventKey="paid" title="Paid">
                  {filteredCampaigns.paidCampaigns.length > 0 ? (
                    <PaidCampaigns campaigns={filteredCampaigns.paidCampaigns} />
                  ) : (
                    <p>No paid campaigns.</p>
                  )}
                </Tab>
              </Tabs>
            )}
          </>
        ) : (
          <NotLoggedIn />
        )}
      </Container>
    </div>
  );
};

export default Hero;
