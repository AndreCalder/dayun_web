"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AboutImageType } from "@/lib/definitions";
import { getAboutImages } from "@/app/api";
import { Lightbox } from "@/components/ui/lightbox";
import { Button } from "@/components/ui/button";

function About() {
    const t = useTranslations("About");
    const [aboutImages, setAboutImages] = useState<AboutImageType[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getData = async () => {
        let imagesRes = await getAboutImages();
        setAboutImages(imagesRes.data.images);
    };
    useEffect(() => {
        getData();
    }, []);

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
        <div className="h-lvh w-svw grid grid-cols-2 py-16 lg:py-0 px-5 lg:px-20 relative">
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-center">
                <div className="container px-6">
                    <h1 className="text-xl lg:text-2xl underline underline-offset-8 pb-10">
                        {t("title")}
                    </h1>
                    <p className="text-base lg:text-lg text-ellipsis whitespace-pre-wrap">
                        {t("t1").toUpperCase()}
                    </p>
                    <h1 className="text-xl lg:text-3xl my-6">
                        ESTUDIODAYUN@GMAIL.COM
                    </h1>
                    <p className="text-lg whitespace-pre-wrap">{t("t2")}</p>
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
                        <p className="text-lg">{t("t3")}</p>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex justify-center items-center px-2">
                        <Button className="cursor-pointer bg-white hover:bg-black hover:text-white text-black border-2 border-black rounded-none w-full">
                            {t("here")}
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
