import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useGetCampaignByIdQuery } from '../slices/campaignApiSlice';
import Loader from './Loader';
import { FaCalendarAlt, FaMoneyBillAlt, FaMapMarkerAlt, FaClock, FaHourglass, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const CampaignDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetCampaignByIdQuery(id);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.campaign) {
    return <p>Campaign not found.</p>;
  }

  const { campaignName, startDate, endDate, totalBudget, locations, dayFrequency, timeSlots, hoursLeft, paymentStatus } = data.campaign;

  const iconSize = '2rem';

  return (
    <Container className='py-4'>
      <h3 className="mb-4">{campaignName}</h3>
      <Row xs={1} md={2} lg={4} className="g-4">
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaCalendarAlt size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Start Date</Card.Title>
                  <Card.Text>{new Date(startDate).toLocaleDateString()}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaCalendarAlt size={iconSize} className='me-3' />
                <div>
                  <Card.Title>End Date</Card.Title>
                  <Card.Text>{new Date(endDate).toLocaleDateString()}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaMoneyBillAlt size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Total Budget</Card.Title>
                  <Card.Text>INR {totalBudget}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaMapMarkerAlt size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Locations</Card.Title>
                  <Card.Text>{locations.join(', ')}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaClock size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Day Frequency</Card.Title>
                  <Card.Text>{dayFrequency}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaClock size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Time Slots</Card.Title>
                  <Card.Text>{timeSlots.join(', ')}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                <FaHourglass size={iconSize} className='me-3' />
                <div>
                  <Card.Title>Hours Left</Card.Title>
                  <Card.Text>{hoursLeft}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='h-100'>
            <Card.Body>
              <div className='d-flex align-items-center'>
                {paymentStatus === 'paid' ? (
                  <FaCheckCircle size={iconSize} className='me-3 text-success' />
                ) : (
                  <FaTimesCircle size={iconSize} className='me-3 text-danger' />
                )}
                <div>
                  <Card.Title>Payment Status</Card.Title>
                  <Card.Text>{paymentStatus}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CampaignDetails;
