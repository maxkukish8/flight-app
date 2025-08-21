//custom wrapper for RTK Query

import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { http } from './http';

type AxiosArgs = {
    url: string;
    method?: AxiosRequestConfig['method'];
    params?: AxiosRequestConfig['params'];
    data?: AxiosRequestConfig['data'];
};

export const axiosBaseQuery =
    (): BaseQueryFn<AxiosArgs, unknown, { status?: number; data?: unknown }> =>
    async ({ url, method = 'GET', params, data }) => {
        try {
            const result = await http.request({ url, method, params, data });
            return { data: result.data };
        } catch (e) {
            const err = e as AxiosError;
            return {
                error: { status: err.response?.status, data: err.response?.data },
            };
        }
    };
