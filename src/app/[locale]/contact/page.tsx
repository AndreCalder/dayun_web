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
                    className="text-xl lg:text-4xl my-6 mx-5 lg:mx-10 font-bold tracking-wide"
                >
                    ESTUDIODAYUN@GMAIL.COM
                </Link>
                <Link
                    href="https://www.instagram.com/dayun/"
                    className="text-xl lg:text-4xl my-6 mx-5 lg:mx-10 font-bold tracking-wide"
                >
                    INSTAGRAM &gt;
                </Link>
            </div>
            <Image
                src="/Dayun_Face.png"
                alt="About"
                width={550}
                height={550}
                className="hidden lg:block lg:absolute bottom-0 right-[17%]"
            />
            <Image
                src="/Dayun_Face.png"
                alt="About"
                width={300}
                height={300}
                className="absolute lg:hidden bottom-0 right-0 left-0"
            />
        </div>
    );
}

export default Contact;
