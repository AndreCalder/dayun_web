"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { getCovers } from '../api';
import ImgCarousel from '@/components/toolkit/ImgCarousel';

export default function HomePage() {
    const t = useTranslations('HomePage');
    const [coverImages, setCoverImages] = useState<Array<string>>([]);
    const getCoverImages = async () => {
        const coversRes = await getCovers();
        console.log(coversRes);
        setCoverImages(coversRes.data.map((cover: { img_url: string }) => cover.img_url));
    }
    useEffect(() => {
        getCoverImages();
    }, []);

    return (
        <div className='h-svh overflow-hidden'>
            <ImgCarousel img_links={coverImages} />
        </div>
    );
}