import { useSession } from "next-auth/react";
import axios, { AxiosRequestConfig } from "axios";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useApi() {
  const { data: session } = useSession();

  const request = useCallback(
    async <T = any>(
      method: "get" | "post" | "put" | "delete" | "patch",
      path: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      const token = (session as any)?.accessToken;
      const res = await axios({
        method,
        url: `${API_URL}${path}`,
        data,
        ...config,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...config?.headers,
        },
      });
      return res.data;
    },
    [session]
  );

  return {
    get: <T = any>(path: string, config?: AxiosRequestConfig) =>
      request<T>("get", path, undefined, config),
    post: <T = any>(path: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>("post", path, data, config),
    put: <T = any>(path: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>("put", path, data, config),
    del: <T = any>(path: string, config?: AxiosRequestConfig) =>
      request<T>("delete", path, undefined, config),
  };
}
