import axios, { AxiosResponse } from 'axios';

// Create an axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // You can switch to your production URL here
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 2000, // Timeout after 2 seconds
  // withCredentials: true, // Uncomment if you need to send cookies/credentials with the requests
});

// Generic function to define the response structure
async function getRequest<T>(URL: string): Promise<AxiosResponse<T>> {
  return axiosClient.get<T>(URL).then((response) => response);
}

async function postRequest<T>(URL: string, payload: any): Promise<AxiosResponse<T>> {
  return axiosClient.post<T>(URL, payload).then((response) => response);
}

async function patchRequest<T>(URL: string, payload: any): Promise<AxiosResponse<T>> {
  return axiosClient.patch<T>(URL, payload).then((response) => response);
}

async function deleteRequest<T>(URL: string): Promise<AxiosResponse<T>> {
  return axiosClient.delete<T>(URL).then((response) => response);
}

export { getRequest, postRequest, patchRequest, deleteRequest };
