import { apiSlice } from '../../api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                data: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: '/user/register', // Corrected to match backend route
                method: 'POST',
                data: userInfo,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
