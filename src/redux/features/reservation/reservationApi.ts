import { apiSlice } from "../../api/apiSlice";

export const reservationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReservation: builder.mutation({
            query: (data) => ({
                url: "/reservations",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Reservation"],
        }),
        getAllReservations: builder.query({
            query: () => ({ url: "/reservations" }),
            providesTags: ["Reservation"],
        }),
        getMyReservations: builder.query({
            query: () => ({ url: "/reservations/my" }),
            providesTags: ["Reservation"],
        }),
        updateReservationStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/reservations/${id}`,
                method: "PATCH",
                data: { status },
            }),
            invalidatesTags: ["Reservation"],
        }),
        updateReservation: builder.mutation({
            query: ({ id, data }) => ({
                url: `/reservations/${id}`,
                method: "PUT", // or PATCH, but PUT is common for full updates
                data,
            }),
            invalidatesTags: ["Reservation"],
        }),
    }),
});

export const {
    useCreateReservationMutation,
    useGetAllReservationsQuery,
    useGetMyReservationsQuery,
    useUpdateReservationStatusMutation,
    useUpdateReservationMutation,
} = reservationApi;
