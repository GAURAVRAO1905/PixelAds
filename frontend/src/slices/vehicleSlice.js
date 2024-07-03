import { apiSlice } from './apiSlice';

const LOCATIONS_URL = '/api/vehicle';

export const vehicleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerVehicle: builder.mutation({
      query: (vehicle) => ({
        url: `${LOCATIONS_URL}/register`,
        method: 'POST',
        body: vehicle,
      }),
    }),
   
  }),
});

export const { useRegisterVehicleMutation } = vehicleApi;
