import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Url"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1",
  }),
  endpoints: (builder) => ({
    getUrl: builder.query({
      query: () => "/stats",
      providesTags: ["Url"],
    }),
    shortenUrl: builder.mutation({
      query: (body) => ({
        url: "/shorten",
        method: "POST",
        body : JSON.stringify(body),
      }),
      invalidatesTags: ["Url"],
    }),
    getRedirect: builder.query({
      query: (shortUrl) => `/shorturl/${shortUrl}`,
    }),
  }),
});

export const { useGetUrlQuery, useShortenUrlMutation, useGetRedirectQuery } =
  api;
