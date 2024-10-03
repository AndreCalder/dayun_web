"use client";

import React from "react";

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  return { sidebarOpen, setSidebarOpen };
};
