"use client";

import React, { ReactNode, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  LayoutPanelLeft,
  BookText,
  UsersIcon,
  LucideMessageCircleQuestion,
  CircleHelp,
  Cross,
  X,
  Building,
  BookCheck,
  ImageIcon,
  ShoppingBag,
} from "lucide-react";

import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface sidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

type MenuItemType = {
  link: string;
  text: string;
  icon: ReactNode;
  requiredRole?: string;
};

const Sidebar: React.FC<sidebarProps> = ({ sidebarOpen, toggleSidebar }) => {

  const pathname = usePathname();

  const menulist = [
    {
      items: [
        {
          link: `/admin/covers`,
          text: "Portadas Inicio",
          icon: <ImageIcon className="h-5 w-5" />,
        },
        {
          link: `/admin/about-images`,
          text: "Imágenes About",
          icon: <ImageIcon className="h-5 w-5" />,
        },
        {
          link: `/admin/obras`,
          text: "Obras",
          icon: <ImageIcon className="h-5 w-5" />,
        },
        {
          link: `/admin/projects`,
          text: "Proyectos",
          icon: <BookCheck className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`transition-transform	${sidebarOpen
        ? "-translate-x-0 w-full s:w-[300px]"
        : "-translate-x-full sm:-translate-x-0"
        } bg-white sm:translate-x-0 fixed sm:w-[300px] sm:min-w-[300px] min-h-screen py-4 h-full flex flex-col justify-center items-center z-50`}
    >
      <div className="w-full flex justify-end sm:hidden">
        <X onClick={() => toggleSidebar()} />
      </div>
      <div className="basis-1/8">
        <Link href={`/admin/home`}>
          <Image src="/Logo_Vector.svg" alt="Logo" width={155} height={55} />
        </Link>
      </div>
      <Command className="basis-7/8 h-full bg-none">

        <CommandList className="align-baseline justify-between p-0">
          {menulist.map((menu: any, key: number) => (
            <CommandGroup heading="" key={key}>
              {menu.items.map((menuItem: MenuItemType, key: number) => (
                <React.Fragment key={key}>
                  <Link
                    onClick={() => toggleSidebar()}
                    href={menuItem.link}
                    className={`flex p-2 font-[600] items-center ${pathname
                      .toLocaleLowerCase()
                      .includes(menuItem.link.toLowerCase())
                      ? "disabled bg-gray-200 text-black"
                      : "text-gray-400"
                      }`}
                    key={menuItem.text}
                  >
                    <div
                      className={`${pathname
                        .toLowerCase()
                        .includes(menuItem.link.toLowerCase())
                        ? "disable text-black"
                        : "text-gray-400"
                        } flex justify-center items-center rounded-xl w-8 h-8 mr-2`}
                    >
                      {menuItem.icon}
                    </div>
                    <span>{menuItem.text}</span>
                  </Link>
                </React.Fragment>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </aside>
  );
};

export default Sidebar;
