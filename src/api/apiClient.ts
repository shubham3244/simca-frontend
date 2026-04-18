import { env } from "../config/env";
import type { ApiErrorResponse } from "../types/api.types";

const BASE_URL = env.API_BASE_URL;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': "application/json",
    ...options.headers,
  };
  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // sends HttpOnly cookies automatically
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({
      statusCode: response.status,
      code: "UNKNOWN_ERROR",
      message: response.statusText || "Something went wrong",
    }));
    throw error;
  }
  // Handle 204 No Content
  if (response.status ===204) {
    return {} as T;
  }
  return response.json();
}
export const apiClient = {
  get<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },
  post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  
  delete<T>(endpoint:string,options?:RequestInit){
    return request<T>(endpoint,{
        ...options,
        method:'DELETE',

    })
  },
  patch<T>(endpoint:string,body?:unknown ,options?:RequestInit){
return request<T>(endpoint,{
    ...options,
    method:'PATCH',
    body: body?JSON.stringify(body):undefined
})
  },
    put<T>(endpoint:string,body?:unknown ,options?:RequestInit){
return request<T>(endpoint,{
    ...options,
    method:'PUT',
    body: body?JSON.stringify(body):undefined
})
  }
};
