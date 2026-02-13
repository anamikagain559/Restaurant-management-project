import { apiSlice } from "../../api/apiSlice";

export const menuApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMenu: builder.query({
            query: () => ({ url: "/menu" }),
            providesTags: ["Menu"],
        }),
        createMenu: builder.mutation({
            query: (data) => ({
                url: "/menu",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Menu"],
        }),
        updateMenu: builder.mutation({
            query: ({ id, data }) => ({
                url: `/menu/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: ["Menu"],
        }),
        deleteMenu: builder.mutation({
            query: (id) => ({
                url: `/menu/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Menu"],
        }),
    }),
});

export const {
    useGetAllMenuQuery,
    useCreateMenuMutation,
    useUpdateMenuMutation,
    useDeleteMenuMutation,
} = menuApi;
