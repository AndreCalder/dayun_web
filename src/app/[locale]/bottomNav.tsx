"use client";
import React, { useEffect, useState } from "react";
import { Locale, usePathname, useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ProjectType } from "@/lib/definitions";
import { getProjects } from "../api";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function BottomNav() {
    const t = useTranslations("HomePage");
    const pathname = usePathname();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            if (response.status === 200 && response.data.projects) {
                setProjects(response.data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="w-screen hidden fixed bottom-0 py-5 lg:grid grid-cols-3 ">
            <div className="hidden col-span-1 lg:flex justify-center">
                <DropdownMenu onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <p
                            className={`text-2xl cursor-pointer text-center hover:font-bold flex items-center justify-center gap-2 ${
                                pathname === "/" || pathname === "/catalog"
                                    ? "text-white"
                                    : "text-black"
                            }`}
                        >
                            {t("projects")}
                            {dropdownOpen ? (
                                <ChevronDown
                                    size={20}
                                    className={`${
                                        pathname === "/" ||
                                        pathname === "/catalog"
                                            ? "text-white"
                                            : "text-black"
                                    }`}
                                />
                            ) : (
                                <ChevronUp
                                    size={20}
                                    className={`${
                                        pathname === "/" ||
                                        pathname === "/catalog"
                                            ? "text-white"
                                            : "text-black"
                                    }`}
                                />
                            )}
                        </p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        align="start"
                        className="mb-2 max-h-80 overflow-y-auto bg-transparent border-none shadow-none"
                    >
                        {loading ? (
                            <DropdownMenuItem disabled>
                                <span className="text-sm text-gray-500">
                                    ...
                                </span>
                            </DropdownMenuItem>
                        ) : projects.length > 0 ? (
                            projects.map((project) => (
                                <DropdownMenuItem
                                    key={project._id?.$oid}
                                    asChild
                                    className="bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent"
                                >
                                    <Link
                                        href={`/projects/${project._id?.$oid}`}
                                        className={`w-full cursor-pointer px-2 py-1 ${
                                            pathname === "/" ||
                                            pathname === "/catalog"
                                                ? "text-white hover:text-white"
                                                : "text-black hover:text-black"
                                        } hover:bg-transparent focus:bg-transparent`}
                                    >
                                        <span className="text-lg truncate">
                                            {project.title}
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>
                                <span className="text-sm text-gray-500">
                                    No hay proyectos disponibles
                                </span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex w-full items-center justify-center">
                <Link href="/works">
                    <p
                        className={`hidden lg:block text-2xl cursor-pointer text-center hover:font-bold ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        }`}
                    >
                        {t("works")}
                    </p>
                </Link>
                <p
                    className={`mx-3 hidden lg:block text-2xl cursor-pointer hover:font-bold ${
                        pathname === "/" || pathname === "/catalog"
                            ? "text-white"
                            : "text-black"
                    }`}
                >
                    |
                </p>
                <Link href="/catalog">
                    <p
                        className={`hidden lg:block text-2xl cursor-pointer text-center hover:font-bold ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        }`}
                    >
                        {t("catalog")}
                    </p>
                </Link>
            </div>
            <Link href="/contact">
                <p
                    className={`hidden lg:block text-2xl cursor-pointer text-center hover:font-bold ${
                        pathname === "/" || pathname === "/catalog"
                            ? "text-white"
                            : "text-black"
                    }`}
                >
                    {t("contact")}
                </p>
            </Link>
        </div>
    );
}

export default BottomNav;
