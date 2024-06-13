import { apiSlice } from './apiSlice';

const LOCATIONS_URL = '/api/location';

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLocation: builder.mutation({
      query: (formData) => ({
        url: `${LOCATIONS_URL}/create`,
        method: 'POST',
        body: formData,
      }),
    }),
    getHotspots: builder.query({
      query: () => ({
        url: `${LOCATIONS_URL}/hotspots`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useCreateLocationMutation, useGetHotspotsQuery } = locationApi;
