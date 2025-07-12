"use client";

import axiosInstance from "../api";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSidebar } from "./useSidebar";
import { useLocale } from "next-intl";
import Sidebar from "@/components/toolkit/Sidebar";
import Header from "@/components/toolkit/Header";

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useSidebar();

  const getSession = async (router: AppRouterInstance) => {
    axiosInstance
      .post(
        "/auth/validatetoken",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        }
      )
      .then((response) => {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: response.data.username,
            roles: response.data.roles,
          })
        );
      })
      .catch((error) => {
        localStorage.removeItem("access_token");
        router.replace(`/login`);
      });
  };

  useEffect(() => {
    getSession(router);
  }, [pathname]);

  const style = {
    backgroundColor: "#F8F9FA",
  };
  const toggleSidebar = () => sidebar.setSidebarOpen(!sidebar.sidebarOpen);

  return (
    <div className="h-full w-full" style={style}>
      <Sidebar
        sidebarOpen={sidebar.sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="flex w-full h-svh flex-col min-h-screen sm:pl-[300px]">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 px-2 sm:px-10 bg-gray-100 pb-5 overflow-y-scroll">
          {children}
        </div>
      </main>
    </div>
  );
}
