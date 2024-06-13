import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useCreateLocationMutation } from '../slices/locationApiSlice';

const CreateLocationScreen = () => {
  const [hotspot, setHotspot] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createLocation] = useCreateLocationMutation();

  const handleFileChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!hotspot || !latitude || !longitude || !radius || mediaFiles.length === 0) {
      toast.error('Please fill out all fields');
      return;
    }

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      toast.error('Please enter valid latitude and longitude values');
      return;
    }

    if (!isValidRadius(radius)) {
      toast.error('Please enter a valid radius value');
      return;
    }

    const formData = new FormData();
    formData.append('hotspot', hotspot);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('radius', radius);
    mediaFiles.forEach((file) => {
      formData.append('mediaFile', file);
    });

    try {
      setIsLoading(true);
      const res = await createLocation(formData).unwrap();
      setIsLoading(false);
      toast.success('Location created successfully');
      navigate('/');
      console.log('Location created:', res);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.data?.message || error.error);
    }
  };

  const isValidLatitude = (lat) => {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  };

  const isValidLongitude = (lng) => {
    return !isNaN(lng) && lng >= -180 && lng <= 180;
  };

  const isValidRadius = (rad) => {
    return !isNaN(rad) && rad > 0; // Assuming radius should be a positive number
  };

  return (
    <FormContainer>
      <h1>Create Hotspot</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='hotspot'>
          <Form.Label>Hotspot *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Hotspot'
            value={hotspot}
            onChange={(e) => setHotspot(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='latitude'>
          <Form.Label>Latitude *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Latitude'
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='longitude'>
          <Form.Label>Longitude *</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Longitude'
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='radius'>
          <Form.Label>Radius *</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter Radius'
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='mediaFiles'>
          <Form.Label>Upload Images *</Form.Label>
          <Form.Control
            type='file'
            multiple
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Button variant='primary' type='submit' disabled={isLoading}>
          {isLoading ? <Loader /> : 'Submit'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateLocationScreen;
