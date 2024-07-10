import { Card, Button, Container } from 'react-bootstrap';

const PendingCampaigns = ({ campaigns, isLoadingKey, isLoadingCheckout, keyError, checkoutHandler }) => {
  return (
    <Container className='d-flex flex-wrap'>
      {campaigns.map((campaign) => (
        <Card key={campaign._id} className='m-2' style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{campaign.campaignName}</Card.Title>
            <Card.Text>
              Start Date: {new Date(campaign.startDate).toLocaleDateString()}<br />
              End Date: {new Date(campaign.endDate).toLocaleDateString()}<br />
              Total Budget: INR {campaign.totalBudget}
            </Card.Text>
            <Button
              variant='primary'
              disabled={isLoadingKey || isLoadingCheckout}
              onClick={() => {
                checkoutHandler(campaign._id, campaign.totalBudget);
              }}
            >
              Pay Now
            </Button>
            {keyError && (
              <p>Error loading payment key: {keyError?.data?.message || keyError?.message || 'Unknown error'}</p>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default PendingCampaigns;
