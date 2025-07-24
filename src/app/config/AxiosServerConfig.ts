import axios, { InternalAxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

const repository = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});


repository.interceptors.request.use(
    async (config:InternalAxiosRequestConfig) => {
        if(!config.url?.startsWith("/public")){
            if(!config.headers.Authorization){
                const session = await getServerSession(authOptions)
                config.headers["Authorization"] = `Bearer ${session?.accessToken}`
            }
        }
        return config;
    }
);
repository.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export default repository;