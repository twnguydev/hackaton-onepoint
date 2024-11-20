import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/interfaces/ApiResponse';
import { Station } from '@/interfaces/Station';

const BASE_URL = 'https://api.atmosud.org/observations/';

interface FetchOptions {
    endpoint: string;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

export async function ApiFetch(options: FetchOptions): Promise<Station[]> {
    try {
        const url = `${BASE_URL}${options.endpoint}`;
        const response = await axios.get<ApiResponse>(url, {
            params: options.params,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        return response.data.stations;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Erreur API:', axiosError.response?.data || axiosError.message);
        } else {
            console.error('Erreur inattendue:', error);
        }
        throw error;
    }
}