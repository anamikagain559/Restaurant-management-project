import { apiSlice } from "../../api/apiSlice";

export const tableApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTables: builder.query({
            query: () => ({
                url: "/tables",
                method: "GET",
            }),
            providesTags: ["Table"],
        }),
        createTable: builder.mutation({
            query: (data) => ({
                url: "/tables",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Table"],
        }),
        updateTable: builder.mutation({
            query: ({ id, data }) => ({
                url: `/tables/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: ["Table"],
        }),
        deleteTable: builder.mutation({
            query: (id) => ({
                url: `/tables/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Table"],
        }),
    }),
});

export const {
    useGetAllTablesQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
} = tableApi;
