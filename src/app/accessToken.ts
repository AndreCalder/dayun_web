"use client";

export const saveAccessToken = (token: string) =>
    localStorage.setItem("access_token", token);

export const getAccessToken = () => localStorage.getItem("access_token");
