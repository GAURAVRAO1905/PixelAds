import { Card, Button } from 'react-bootstrap';

const NotLoggedIn = () => (
  <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
    <h1 className='text-center mb-4'>PIXEL ADS</h1>
    <p className='text-center mb-4'>
      This is a platform to show your advertisement to the World. Join with us!
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
);

export default NotLoggedIn;
