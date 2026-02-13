/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({ baseUrl: '/api/v1' }),
    tagTypes: ['User'],
    endpoints: () => ({}),
})
