import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterVehicleMutation } from '../slices/vehicleSlice';

const VehicleRegisterScreen = () => {
  const [vehiclenumber, setVehicleNumber] = useState('');
  const [softwareid, setSoftwareId] = useState('');
  const [drivername, setDriverName] = useState('');
  const [drivercontact, setDriverContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [registerVehicle] = useRegisterVehicleMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!vehiclenumber || !softwareid || !drivername || !drivercontact) {
      toast.error('Please fill out all fields');
      return;
    }

    if (!isValidContact(drivercontact)) {
      toast.error('Please enter a valid contact number');
      return;
    }

    try {
      setIsLoading(true);
      const res = await registerVehicle({ vehiclenumber, softwareid, drivername, drivercontact }).unwrap();
      setIsLoading(false);
      toast.success('Vehicle registered successfully');
      navigate('/');
      console.log('Vehicle registered:', res);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.data?.message || error.error);
    }
  };

  const isValidContact = (contact) => {
    return !isNaN(contact) && contact.toString().length === 10; // Assuming contact number is 10 digits
  };

  return (
    <FormContainer>
      <h1>Register Vehicle</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='vehiclenumber'>
          <Form.Label>Vehicle Number *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Vehicle Number'
            value={vehiclenumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='softwareid'>
          <Form.Label>Software ID *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Software ID'
            value={softwareid}
            onChange={(e) => setSoftwareId(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='drivername'>
          <Form.Label>Driver Name *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Driver Name'
            value={drivername}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='drivercontact'>
          <Form.Label>Driver Contact *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Driver Contact'
            value={drivercontact}
            onChange={(e) => setDriverContact(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant='primary' type='submit' className='mt-3' disabled={isLoading}>
          {isLoading ? <Loader /> : 'Submit'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default VehicleRegisterScreen;
