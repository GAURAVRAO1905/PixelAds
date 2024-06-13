import { apiSlice } from './apiSlice';

const CAMPAIGNS_URL = '/api/campaign';

export const campaignApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCampaign: builder.mutation({
      query: (formData) => ({
        url: `${CAMPAIGNS_URL}/create`,
        method: 'POST',
        body: formData,
      }),
    }),
    checkout: builder.mutation({
      query: (amount) => ({
        url: `${CAMPAIGNS_URL}/checkout`,
        method: 'POST',
        body: { amount }, // Pass the amount correctly
      }),
    }),
    getKey: builder.query({
      query: () => ({
        url: `/api/getkey`, // Adjust the URL
        method: 'GET',
      }),
    }),
    getCampaignById: builder.query({
      query: (campaignId) => ({
        url: `${CAMPAIGNS_URL}/${campaignId}`,
        method: 'GET',
      }),
    }),
    getCampaignsByUser: builder.query({
      query: () => ({
        url: CAMPAIGNS_URL,
        method: 'GET',
      }),
    }),
    paymentVerification: builder.mutation({
      query: (data) => ({
        url: `${CAMPAIGNS_URL}/paymentverification`,
        method: 'POST',
        body: data,
       // credentials: 'include', // Ensure cookies are included
      }),
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useGetCampaignByIdQuery,
  useGetCampaignsByUserQuery,
  useGetKeyQuery,
  useCheckoutMutation,
  usePaymentVerificationMutation,
} = campaignApiSlice;
