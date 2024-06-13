// Hero.js

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetCampaignsByUserQuery, useGetKeyQuery, useCheckoutMutation, usePaymentVerificationMutation } from '../slices/campaignApiSlice';
import Loader from './Loader';

// Redux can be used to auto refresh the page whenever new campaign is created or payment is done 

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: campaigns, error: campaignsError, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useGetCampaignsByUserQuery();
  const { data: keyData, error: keyError, isLoading: isLoadingKey } = useGetKeyQuery();
  const [checkOut, { isLoading: isLoadingCheckout }] = useCheckoutMutation();
  const [paymentVerification] = usePaymentVerificationMutation();
  const [key, setKey] = useState('pending');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (campaigns) {
      setFilteredCampaigns(campaigns);
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
       // image: "https://your-company-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          const data = {
            campaignId, // Pass campaignId to payment verification
            orderCreationId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await paymentVerification(data).unwrap();

          // Check if payment was successful and redirect accordingly
          if (result.success) {
            // Redirect only if payment was successful and user is authenticated
            if (userInfo) {
              navigate(`/paymentsuccess?reference=${result.reference}`);
            } else {
              console.error('User is not authenticated');
              // Handle not authenticated case
            }
          } else {
            console.error('Payment verification failed:', result.error);
            // Handle payment failure
          }

          //alert(result.msg);
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
            // Handle the case where the checkout form is closed
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
            ) : filteredCampaigns && filteredCampaigns.length > 0 ? (
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="pending" title="Pending">
                  <Container className='d-flex flex-wrap'>
                    {filteredCampaigns
                      .filter((campaign) => campaign.paymentStatus === 'pending')
                      .map((campaign) => (
                        <Card key={campaign._id} className='m-2' style={{ width: '18rem' }}>
                          <Card.Body>
                            <Card.Title>{campaign.campaignName}</Card.Title>
                            <Card.Text>
                              Start Date: {new Date(campaign.startDate).toLocaleDateString()}<br />
                              End Date: {new Date(campaign.endDate).toLocaleDateString()}<br />
                              Total Budget: ${campaign.totalBudget}
                            </Card.Text>
                            {isLoadingKey || isLoadingCheckout ? (
                              <Loader />
                            ) : keyError ? (
                              <p>Error loading payment key: {keyError?.data?.message || keyError?.message || 'Unknown error'}</p>
                            ) : (
                              <Button 
                                variant='primary' 
                                onClick={() => checkoutHandler(campaign._id, campaign.totalBudget)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                  </Container>
                </Tab>
                <Tab eventKey="paid" title="Paid">
                  <Container className='d-flex flex-wrap'>
                    {filteredCampaigns
                      .filter((campaign) => campaign.paymentStatus === 'paid')
                      .map((campaign) => (
                        <Card key={campaign._id} className='m-2' style={{ width: '18rem' }}>
                          <Card.Body>
                            <Card.Title>{campaign.campaignName}</Card.Title>
                            <Card.Text>
                              Start Date: {new Date(campaign.startDate).toLocaleDateString()}<br />
                              End Date: {new Date(campaign.endDate).toLocaleDateString()}<br />
                              Total Budget: ${campaign.totalBudget}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ))}
                  </Container>
                </Tab>
              </Tabs>
            ) : (
              <p>You don't have any campaigns. <Button variant='primary' href='/create-campaign'>Create a Campaign</Button></p>
            )}
          </>
        ) : (
          <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
            <h1 className='text-center mb-4'>PIXEL MATRIX</h1>
            <p className='text-center mb-4'>
              This is a platform to show your advertisement to the World. Join with us.
            </p>
            <div className='d-flex mb-4'>
              <Button variant='primary' href='/login' className='me-3'>
                Sign In
              </Button>
              <Button variant='secondary' href='/register'>
                Register
              </Button>
            </div>
            <p>Please log in to see your campaigns.</p>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Hero;
