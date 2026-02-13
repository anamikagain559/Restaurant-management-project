import { apiSlice } from "../../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Order"],
        }),
        getAllOrders: builder.query({
            query: () => ({ url: "/orders" }),
            providesTags: ["Order"],
        }),
        getMyOrders: builder.query({
            query: () => ({ url: "/orders/my" }),
            providesTags: ["Order"],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}`,
                method: "PATCH",
                data: { status },
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetMyOrdersQuery,
    useUpdateOrderStatusMutation,
} = orderApi;
