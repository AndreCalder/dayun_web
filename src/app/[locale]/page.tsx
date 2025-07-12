"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { getCovers } from "../api";
import ImgCarousel from "@/components/toolkit/ImgCarousel";

export default function HomePage() {
    const t = useTranslations("HomePage");
    const [coverImages, setCoverImages] = useState<Array<string>>([]);
    const getCoverImages = async () => {
        try {
            const res = await getCovers();
            if (res.data && res.data.covers) {
                const validUrls = res.data.covers
                    .map((cover: { img_url: string }) => cover.img_url)
                    .filter((url: string) => url && url.trim() !== "");
                setCoverImages(validUrls);
            } else {
                console.warn("No covers data found in response");
                setCoverImages([]);
            }
        } catch (error) {
            console.error("Error fetching covers:", error);
            setCoverImages([]);
        }
    };
    useEffect(() => {
        getCoverImages();
    }, []);

    return (
        <div className="h-svh overflow-hidden">
            <ImgCarousel swipeText={t("swipe")} img_links={coverImages} />
        </div>
    );
}
