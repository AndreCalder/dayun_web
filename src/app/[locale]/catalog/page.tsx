"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getCatalogsByType } from "@/app/api";
import { CatalogType } from "@/lib/definitions";

function Catalog() {
    const t = useTranslations("Catalog");
    const [catalogs, setCatalogs] = useState<CatalogType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                // Fetch only paintings catalogs for this page
                const response = await getCatalogsByType("paintings");
                setCatalogs(response.data.catalogs || []);
            } catch (error) {
                console.error("Error fetching catalogs:", error);
                setCatalogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    const handleCatalogClick = (url: string) => {
        window.open(url, "_blank");
    };

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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                className="cursor-pointer bg-transparent hover:bg-white hover:text-black text-white border-2 border-white rounded-none min-w-full lg:min-w-48"
                                disabled={loading || catalogs.length === 0}
                            >
                                {loading ? "Loading..." : t("here")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-transparent border-none shadow-none" >
                            <div className="space-y-2">
                                {catalogs.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No catalogs available
                                    </p>
                                ) : (
                                    catalogs?.map((catalog) => (
                                        <button
                                            key={catalog._id?.$oid}
                                            onClick={() =>
                                                handleCatalogClick(catalog.pdf_url)
                                            }
                                            className="w-full text-left p-3 border-[2px] rounded-none text-white hover:text-black font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                                        >
                                            <div className="font-medium text-sm">
                                                {catalog.title}
                                            </div>
                                            {catalog.description && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {catalog.description}
                                                </div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

export default Catalog;
