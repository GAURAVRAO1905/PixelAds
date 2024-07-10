import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PaidCampaigns = ({ campaigns }) => {
  return (
    <Container className='d-flex flex-wrap'>
      {campaigns
        .filter((campaign) => campaign.paymentStatus === 'paid')
        .map((campaign) => (
          <Card key={campaign._id} className='m-2' style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{campaign.campaignName}</Card.Title>
              <Card.Text>
                Start Date: {new Date(campaign.startDate).toLocaleDateString()}<br />
                End Date: {new Date(campaign.endDate).toLocaleDateString()}<br />
                Total Budget: INR {campaign.totalBudget}
              </Card.Text>
              <Link to={`/campaigns/${campaign._id}`}>
                <Button variant='primary'>
                  More Details
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
};

export default PaidCampaigns;
