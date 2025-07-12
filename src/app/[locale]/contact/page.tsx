"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

function Contact() {
    const t = useTranslations("Contact");

    return (
        <div className="h-svh w-svw grid grid-cols-2 px-5 lg:px-20 relative overflow-y-hidden py-16">
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-start lg:justify-center">
                <div className="container px-5 lg:px-10">
                    <h1 className="text-2xl underline underline-offset-8 pb-10">
                        {t("title")}
                    </h1>
                    <p
                        className="text-md text-pretty"
                        style={{ lineBreak: "auto" }}
                    >
                        {t("t").toUpperCase()}
                    </p>
                </div>
                <Link
                    href="mailto:estudiodayun@gmail.com"
                    className="text-xl lg:text-3xl my-6 mx-5 lg:mx-10 font-bold tracking-wide z-10 text-shadow-2xs text-shadow-white"
                >
                    ESTUDIODAYUN@GMAIL.COM
                </Link>
                <Link
                    href="https://www.instagram.com/dayun/"
                    className="text-xl lg:text-3xl my-6 mx-5 lg:mx-10 font-bold tracking-wide z-10 text-shadow-2xs text-shadow-white"
                >
                    INSTAGRAM &gt;
                </Link>
            </div>
            <Image
                src="/Dayun_Face.png"
                alt="About"
                width={450}
                height={450}
                className="hidden lg:block lg:absolute bottom-0 max-w-[350px] lg:max-w-[450px] right-[6%] xl:right-[14%]"
            />
            <Image
                src="/Dayun_Face.png"
                alt="About"
                width={600}
                height={600}
                className="absolute max-w-96 sm:max-w-3/4 lg:hidden bottom-0 left-1/2 -translate-x-1/2"
            />
        </div>
    );
}

export default Contact;
