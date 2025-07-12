"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Catalog() {
    const t = useTranslations("Catalog");

    return (
        <div
            className="h-svh w-svw grid grid-cols-2 px-5 lg:px-20 relative overflow-y-hidden py-16"
            style={{
                backgroundImage: "url('/Catalog_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-center">
                <div className="container px-5 lg:px-10 flex flex-col gap-y-6">
                    <h1 className="text-2xl underline underline-offset-8  text-white">
                        {t("title")}
                    </h1>
                    <p
                        className="text-md text-pretty text-white tracking-wide"
                        style={{ lineBreak: "auto" }}
                    >
                        {t("t1").toUpperCase()}
                    </p>
                    <Button className="cursor-pointer bg-transparent hover:bg-white hover:text-black text-white border-2 border-white rounded-none min-w-full lg:min-w-48">
                        {t("here")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Catalog;
