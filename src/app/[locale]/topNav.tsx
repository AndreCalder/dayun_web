"use client";
import React, { useState, useEffect } from "react";
import { Locale, usePathname, useRouter, Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ProjectType } from "@/lib/definitions";
import { getProjects } from "../api";

function TopNav() {
    const t = useTranslations("HomePage");
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [showProjects, setShowProjects] = useState(false);
    const [loading, setLoading] = useState(true);

    const changeLocale = (locale: string) => {
        const newLocale = locale as Locale;
        router.replace(pathname, { locale: newLocale });
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = "unset";
    };

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

    useEffect(() => {
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <>
            <div className="w-screen z-10 fixed top-0 py-5 hidden sm:grid grid-cols-3">
                <Link href="/about">
                    <p
                        className={`hidden lg:block text-2xl cursor-pointer text-center hover:font-bold transition-all duration-300 ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        } ${
                            pathname === "/about"
                                ? "font-extrabold scale-105"
                                : ""
                        }`}
                    >
                        {t("about")}
                    </p>
                </Link>
                <div className="flex justify-center items-center">
                    {pathname === "/" || pathname === "/catalog" ? (
                        <Link href="/">
                            <Image
                                className="cursor-pointer hover:scale-110 transition-all duration-300"
                                src="/Dayun_White.svg"
                                alt="Dayun"
                                width={100}
                                height={100}
                            />
                        </Link>
                    ) : (
                        <Link href="/">
                            <Image
                                className="cursor-pointer hover:scale-110 transition-all duration-300"
                                src="/Dayun_Black.svg"
                                alt="Dayun"
                                width={100}
                                height={100}
                            />
                        </Link>
                    )}
                </div>
                <div className="flex justify-center">
                    <p
                        className={`hidden lg:block cursor-pointer hover:font-bold transition-all duration-300 ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        } ${
                            currentLocale === "en-us"
                                ? "font-extrabold scale-105"
                                : ""
                        }`}
                        onClick={() => changeLocale("en-us")}
                    >
                        ENG
                    </p>
                    <p
                        className={`mx-3 hidden lg:block ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        }`}
                    >
                        |
                    </p>
                    <p
                        className={`hidden lg:block cursor-pointer hover:font-bold transition-all duration-300 ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        } ${
                            currentLocale === "es"
                                ? "font-extrabold scale-105"
                                : ""
                        }`}
                        onClick={() => changeLocale("es")}
                    >
                        ESP
                    </p>
                </div>
            </div>
            <div className="fixed w-screen top-0 py-5 sm:hidden flex justify-between px-6 z-10">
                {pathname === "/" || pathname === "/catalog" ? (
                    <Link href="/">
                        <Image
                            className="cursor-pointer hover:scale-110 transition-all duration-300"
                            src="/Dayun_White.svg"
                            alt="Dayun"
                            width={100}
                            height={100}
                        />
                    </Link>
                ) : (
                    <Link href="/">
                        <Image
                            className="cursor-pointer hover:scale-110 transition-all duration-300"
                            src="/Dayun_Black.svg"
                            alt="Dayun"
                            width={100}
                            height={100}
                        />
                    </Link>
                )}
                <button onClick={toggleMenu}>
                    <Menu
                        id="menu-icon"
                        size={28}
                        className={`${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        }`}
                    />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed top-0 left-0 h-full w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ease-in-out z-50 ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-[100%]"
                }`}
            >
                <div className="flex justify-between items-center p-6 border-b bg-white border-gray-200">
                    <Link href="/" onClick={closeMenu}>
                        <Image
                            className="cursor-pointer hover:scale-110 transition-all duration-300"
                            src="/Dayun_Black.svg"
                            alt="Dayun"
                            width={80}
                            height={80}
                        />
                    </Link>
                    <button onClick={toggleMenu}>
                        <X size={24} className="text-black" />
                    </button>
                </div>

                <div className="flex flex-col h-full px-6 py-8">
                    <div className="flex flex-col space-y-6">
                        <Link href="/about" onClick={closeMenu}>
                            <p
                                className={`text-2xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                    pathname === "/about"
                                        ? "font-extrabold scale-105"
                                        : ""
                                }`}
                            >
                                {t("about")}
                            </p>
                        </Link>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => setShowProjects(!showProjects)}
                                className={`text-2xl cursor-pointer hover:font-bold transition-all duration-300 text-black flex items-center gap-2 text-left ${
                                    pathname.startsWith("/projects")
                                        ? "font-extrabold scale-105"
                                        : ""
                                }`}
                            >
                                {t("projects")}
                                <ChevronDown
                                    size={20}
                                    className={`text-black transition-transform ${
                                        showProjects ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showProjects && (
                                <div className="flex flex-col space-y-3 pl-4 border-l-2 border-gray-200">
                                    {loading ? (
                                        <span className="text-base text-gray-500">
                                            ...
                                        </span>
                                    ) : projects.length > 0 ? (
                                        projects.map((project) => (
                                            <Link
                                                key={project._id?.$oid}
                                                href={`/projects/${project._id?.$oid}`}
                                                onClick={closeMenu}
                                                className="text-lg text-black hover:font-bold transition-all duration-300 text-left"
                                            >
                                                {project.title}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="text-base text-gray-500">
                                            No hay proyectos disponibles
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/works" onClick={closeMenu}>
                            <p
                                className={`text-2xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                    pathname === "/works"
                                        ? "font-extrabold scale-105"
                                        : ""
                                }`}
                            >
                                {t("works")}
                            </p>
                        </Link>

                        <Link href="/catalog" onClick={closeMenu}>
                            <p
                                className={`text-2xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                    pathname === "/catalog"
                                        ? "font-extrabold scale-105"
                                        : ""
                                }`}
                            >
                                {t("catalog")}
                            </p>
                        </Link>

                        <Link href="/contact" onClick={closeMenu}>
                            <p
                                className={`text-2xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                    pathname === "/contact"
                                        ? "font-extrabold scale-105"
                                        : ""
                                }`}
                            >
                                {t("contact")}
                            </p>
                        </Link>

                        <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                            <div className="flex space-x-4">
                                <button
                                    className={`text-xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                        currentLocale === "en-us"
                                            ? "font-extrabold scale-105"
                                            : ""
                                    }`}
                                    onClick={() => changeLocale("en-us")}
                                >
                                    ENG
                                </button>
                                <p className="text-xl text-black">|</p>
                                <button
                                    className={`text-xl cursor-pointer hover:font-bold transition-all duration-300 text-black ${
                                        currentLocale === "es"
                                            ? "font-extrabold scale-105"
                                            : ""
                                    }`}
                                    onClick={() => changeLocale("es")}
                                >
                                    ESP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Image
                    src="/Dayun_Face.png"
                    alt="Dayun"
                    width={200}
                    height={200}
                    className="absolute bottom-0 left-0 -translate-x-1/2"
                />
                <Image
                    src="/Dayun_Face.png"
                    alt="Dayun"
                    width={200}
                    height={200}
                    className="absolute bottom-0 right-0 translate-x-1/2"
                />
            </div>
        </>
    );
}

export default TopNav;
