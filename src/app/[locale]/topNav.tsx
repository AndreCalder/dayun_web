"use client";
import React from "react";
import { Locale, usePathname, useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import Image from "next/image";

function TopNav() {
    const t = useTranslations("HomePage");
    const pathname = usePathname();
    const router = useRouter();

    const changeLocale = (locale: string) => {
        const newLocale = locale as Locale;
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <>
            <div className="w-screen z-10 fixed top-0 py-5 hidden sm:grid grid-cols-3">
                <Link href="/about">
                    <p
                        className={`hidden lg:block text-2xl cursor-pointer text-center hover:font-bold ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
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
                        className={`hidden lg:block cursor-pointer hover:font-bold ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
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
                        className={`hidden lg:block cursor-pointer hover:font-bold ${
                            pathname === "/" || pathname === "/catalog"
                                ? "text-white"
                                : "text-black"
                        }`}
                        onClick={() => changeLocale("es")}
                    >
                        ESP
                    </p>
                </div>
            </div>
            <div className="w-screen z-10 fixed top-0 py-5 sm:hidden flex justify-between px-6">
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
                <Menu size={28} className={`${pathname === "/" || pathname === "/catalog" ? "text-white" : "text-black"}`} />
            </div>
        </>
    );
}

export default TopNav;
