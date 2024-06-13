import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useCreateCampaignMutation } from '../slices/campaignApiSlice';
import { useGetHotspotsQuery } from '../slices/locationApiSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const CreateCampaignScreen = () => {
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dayFrequency, setDayFrequency] = useState('');
  const [timeSlots, setTimeSlots] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [endDateError, setEndDateError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: hotspotsData, isLoading: isLoadingHotspots } = useGetHotspotsQuery();
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!campaignName || !startDate || !endDate || !totalBudget || selectedLocations.length === 0 || !dayFrequency || !timeSlots || !mediaFile) {
      toast.error('Please fill out all fields');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setEndDateError('End date must be greater than start date');
      return;
    } else {
      setEndDateError('');
    }

    if (totalBudget < 5000) {
      toast.error('Total budget must be at least 5000');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('campaignName', campaignName);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('totalBudget', totalBudget);
      formData.append('locations', selectedLocations.map(location => location.value).join(','));
      formData.append('dayFrequency', dayFrequency);
      formData.append('timeSlots', timeSlots);
      formData.append('mediaFile', mediaFile);

      const res = await createCampaign(formData).unwrap();
      navigate('/');
      console.log('Campaign created:', res);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handleLocationsChange = (selectedOptions) => {
    setSelectedLocations(selectedOptions);
  };

  return (
    <FormContainer>
      <h1>Create Campaign</h1>
      {isLoadingHotspots ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='campaignName'>
            <Form.Label>
              Campaign Name <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Campaign Name'
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='startDate'>
            <Form.Label>
              Start Date <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type='date'
              placeholder='Enter Start Date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getTodayDate()} // Set min attribute to today's date
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='endDate'>
            <Form.Label>
              End Date <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type='date'
              placeholder='Enter End Date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || getTodayDate()} // Set min attribute to startDate or today's date
              required
            ></Form.Control>
            {endDateError && <small className="text-danger">{endDateError}</small>}
          </Form.Group>

          <Form.Group className='my-2' controlId='totalBudget'>
            <Form.Label>
              Total Budget <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter Total Budget'
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='locations'>
            <Form.Label>
              Locations <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Select
              isMulti
              options={hotspotsData?.map(hotspot => ({ label: hotspot, value: hotspot }))}
              onChange={handleLocationsChange}
              value={selectedLocations}
              placeholder="Select Locations"
              required
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='dayFrequency'>
            <Form.Label>
              Frequency <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              as="select"
              value={dayFrequency}
              onChange={(e) => setDayFrequency(e.target.value)}
              required
            >
              <option value="">Open this select menu</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='timeSlots'>
            <Form.Label>
              Time Slots <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              as="select"
              value={timeSlots}
              onChange={(e) => setTimeSlots(e.target.value)}
              required
            >
              <option value="">Open this select menu</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='mediaFile'>
            <Form.Label>
              Upload file <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type='file'
              onChange={handleFileChange}
              required
            ></Form.Control>
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className='mt-3'
          >
            Submit
          </Button>
        </Form>
      )}

      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default CreateCampaignScreen;
