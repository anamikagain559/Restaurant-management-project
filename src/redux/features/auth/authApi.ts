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
        getMe: builder.query({
            query: () => ({
                url: '/user/me',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/user/me',
                method: 'PATCH',
                data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useUpdateProfileMutation } = authApi;
