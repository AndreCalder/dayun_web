"use client";

import React from "react";
import { LogOut, Menu, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface headerProps {
  toggleSidebar: () => void;
}

const Header: React.FC<headerProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    router.replace(`/login`);
  };

  return (
    <div className="flex top-0 px-4 py-6 items-center justify-between bg-white">
      <div className="flex gap-2">
        <Menu
          onClick={() => toggleSidebar()}
          className="inline-flex sm:hidden text-gray-500 hover:text-gray-600"
        />
      </div>

      <Link className="sm:hidden" href={`/admin/home`}>
        <Image src="/Logo_Vector.svg" alt="Logo" width={155} height={55} />
      </Link>
        
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserCog className="w-5 h-5 text-gray-500 hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex align-middle justify-evenly cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="flex-1 ml-2">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
