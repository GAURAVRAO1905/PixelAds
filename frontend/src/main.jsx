import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreateCampaignScreen from './screens/CreateCampaignScreen.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import CreateLocationScreen from './screens/CreateLocation.jsx';
import VehicleRegisterScreen from './screens/VehicleRegistration.jsx';
import CampaignDetails from './components/CampaignDetails.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path="/create" element={<CreateCampaignScreen/>} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/location" element={<CreateLocationScreen/>} />
        <Route path="/vehicle" element={<VehicleRegisterScreen/>} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
