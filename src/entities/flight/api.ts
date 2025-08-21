//Flight API service (RTK Query)

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery';
import type { Flight } from '@/shared/types/flight';

export const flightApi = createApi({
    reducerPath: 'flightApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (build) => ({
        getFlights: build.query<Flight[], { airline?: string; sort?: string } | void>({
            query: (params) => ({ url: '/flights', method: 'GET', params }),
        }),

        getFlightById: build.query<Flight, string>({
            query: (id) => ({ url: `/flights/${id}`, method: 'GET' }),
        }),
    }),
});

export const { useGetFlightsQuery, useGetFlightByIdQuery } = flightApi;
