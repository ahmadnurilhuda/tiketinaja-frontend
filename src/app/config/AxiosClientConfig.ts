"use client";
import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const repository = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

repository.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();
    const access_token = session?.accessToken;
    if (!config.url?.startsWith("/public")) {
      if (!access_token) {
        window.location.href = "/login";
        return config;
      }
      if (!config.headers.Authorization) {
        console.log(`ini access token di axiox config client ${access_token}`)
        config.headers["Authorization"] = `Bearer ${access_token}`;
      }
    }
    return config;
  }
);

export default repository;
