"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { AboutImageType, AboutTextType, CatalogType } from "@/lib/definitions";
import { getAboutImages, getAboutTexts, getCatalogsByType } from "@/app/api";
import { Lightbox } from "@/components/ui/lightbox";
import { Button } from "@/components/ui/button";

function About() {
    const t = useTranslations("About");
    const locale = useLocale();
    const [aboutImages, setAboutImages] = useState<AboutImageType[]>([]);
    const [aboutTexts, setAboutTexts] = useState<{ [key: string]: string }>({});
    const [illustrationsCatalog, setIllustrationsCatalog] = useState<CatalogType | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getData = async () => {
        let imagesRes = await getAboutImages();
        setAboutImages(imagesRes.data.images);

        // Fetch about texts from backend
        try {
            let textsRes = await getAboutTexts();
            if (textsRes.status === 200 && textsRes.data && textsRes.data.texts) {
                // Convert array of text objects to key-value map with locale-specific text
                const textsMap: { [key: string]: string } = {};
                textsRes.data.texts.forEach((textObj: AboutTextType) => {
                    textsMap[textObj.key] = textObj.texts[locale] || textObj.texts["en-us"] || "";
                });
                setAboutTexts(textsMap);
            }
        } catch (error) {
            console.error("Error fetching about texts:", error);
        }

        // Fetch illustrations catalog
        try {
            let catalogsRes = await getCatalogsByType("illustrations");
            if (catalogsRes.status === 200 && catalogsRes.data && catalogsRes.data.catalogs.length > 0) {
                // Get the most recent catalog (first one, as they're sorted by created_at desc)
                setIllustrationsCatalog(catalogsRes.data.catalogs[0]);
            }
        } catch (error) {
            console.error("Error fetching illustrations catalog:", error);
        }
    };
    useEffect(() => {
        getData();
    }, [locale]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const handleLightboxClose = () => {
        setLightboxOpen(false);
    };

    const handleNavigate = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="h-svh w-svw grid grid-cols-2 my-16 lg:py-0 px-5 lg:px-20 relative overflow-y-scroll overflow-x-hidden">
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-center">
                <div className="container flex flex-col gap-2 px-6">
                    <h1 className="text-xl lg:text-2xl underline underline-offset-8 pb-10">
                        {aboutTexts["title"] || t("title")}
                    </h1>
                    <p className="text-base lg:text-lg text-ellipsis whitespace-pre-wrap">
                        {(aboutTexts["t1"]?.replace(/\\[nN]/g, '\n') || t("t1")).toUpperCase()}
                    </p>
                    <a href={`mailto:${aboutTexts["email"]?.toLowerCase() || "ESTUDIODAYUN@GMAIL.COM"}`} className="text-xl lg:text-3xl my-6">
                        {aboutTexts["email"] || "ESTUDIODAYUN@GMAIL.COM"}
                    </a>
                    <p className="text-lg whitespace-pre-wrap">{aboutTexts["t2"]?.replace(/\\[nN]/g, '\n') || t("t2")}</p>
                </div>
            </div>
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-center items-center">
                <div className="w-full flex flex-wrap justify-center p-4">
                    {aboutImages.slice(0, 7).map((image, index) => (
                        <div
                            key={image._id?.$oid}
                            className="cursor-pointer w-1/3 lg:w-[14%] h-24 p-2 hover:scale-105 transition-all duration-300"
                            onClick={() => handleImageClick(index)}
                        >
                            <div
                                className="h-full w-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${image.img_url})`,
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="w-full grid grid-cols-12 p-4 gap-y-4">
                    <div className="col-span-12 lg:col-span-7 flex justify-center items-center">
                        <p className="text-lg">{aboutTexts["t3"] || t("t3")}</p>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex justify-center items-center px-2">
                        <Button 
                            className="cursor-pointer bg-white hover:bg-black hover:text-white text-black border-2 border-black rounded-none w-full"
                            onClick={() => illustrationsCatalog && window.open(illustrationsCatalog.pdf_url, '_blank')}
                            disabled={!illustrationsCatalog}
                        >
                            {aboutTexts["here"] || t("here")}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={handleLightboxClose}
                images={aboutImages.map((img) => img.img_url)}
                currentIndex={currentImageIndex}
                onNavigate={handleNavigate}
                swipeText={t("swipe")}
            />
        </div>
    );
}

export default About;
