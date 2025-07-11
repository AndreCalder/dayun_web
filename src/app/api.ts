import { MerchType, WorkType } from "@/lib/definitions";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8080",
    headers: {
        "Content-type": "application/json"
    }
});

export const getWorks = () => axiosInstance.get("/works/getData");

export const createWork = (payload: WorkType) => axiosInstance.post("/works/", payload);

// Merch API routes:

export const getMerch = () => axiosInstance.get("/merchs/getData");

export const createMerch = (payload: MerchType) => axiosInstance.post("/merchs/", payload);

export const getMerchItem = (id: string) => axiosInstance.get(`/merchs/${id}`);

export const updateMerchItem = (id: string, payload: MerchType) => axiosInstance.put(`/merchs/${id}`, payload);

// Cover API routes:

export const getCovers = () => axiosInstance.get("/covers/getData");

export default axiosInstance;