import {
    MerchType,
    WorkType,
    CoverType,
    AboutImageType,
    ProjectType,
} from "@/lib/definitions";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://dayun-437519.wl.r.appspot.com",
    headers: {
        "Content-type": "application/json",
    },
});

export const getWorks = () => axiosInstance.get("/works/summary");

export const createWork = (payload: WorkType) =>
    axiosInstance.post("/works/add", payload);

export const getWork = (id: string) => axiosInstance.get(`/works/${id}`);

export const updateWork = (payload: WorkType) =>
    axiosInstance.put(`/works/update`, payload);

export const deleteWork = (id: string) => axiosInstance.delete(`/works/${id}`);

// Project API routes:

export const getProjects = () => axiosInstance.get("/projects/summary");

export const createProject = (payload: ProjectType) =>
    axiosInstance.post("/projects/add", payload);

export const getProject = (id: string) => axiosInstance.get(`/projects/${id}`);

export const updateProject = (payload: ProjectType) =>
    axiosInstance.put(`/projects/update`, payload);

export const deleteProject = (id: string) =>
    axiosInstance.delete(`/projects/${id}`);

// Merch API routes:

export const getMerch = () => axiosInstance.get("/merchs/getData");

export const createMerch = (payload: MerchType) =>
    axiosInstance.post("/merchs/", payload);

export const getMerchItem = (id: string) => axiosInstance.get(`/merchs/${id}`);

export const updateMerchItem = (id: string, payload: MerchType) =>
    axiosInstance.put(`/merchs/${id}`, payload);

// Cover API routes:

export const getCovers = () => axiosInstance.get("/covers/all");

export const createCover = (payload: CoverType) =>
    axiosInstance.post("/covers/add", payload);

// About Images API routes:

export const getAboutImages = () => axiosInstance.get("/about-images/");

export const createAboutImage = (payload: AboutImageType) =>
    axiosInstance.post("/about-images/", payload);

export const updateAboutImage = (payload: AboutImageType) =>
    axiosInstance.put(`/about-images/`, payload);

export const deleteAboutImage = (id: string) =>
    axiosInstance.delete(`/about-images/${id}`);

export default axiosInstance;
