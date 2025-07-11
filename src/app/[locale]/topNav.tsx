"use client";
import Link from 'next/link';
import React from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

function TopNav() {

    const t = useTranslations('HomePage');
    const pathname = usePathname();
    const router = useRouter();

    const changeLocale = (
        locale: string,
    ) => {
        const newLocale = locale as Locale;

        // ...if the user chose Arabic ("ar-eg"),
        // router.replace() will prefix the pathname
        // with this `newLocale`, effectively changing
        // languages by navigating to `/ar-eg/about`.
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <>
        <div className="w-screen z-10 fixed top-0 py-5 hidden sm:grid grid-cols-3">
            <Link href="/"><p className="text-2xl text-center">{t("about")}</p></Link>
            <Link href="/"><p className="text-2xl text-center">DAYUN</p></Link>
            <div className="flex justify-center">
                <p className="cursor-pointer hover:font-bold" onClick={() => changeLocale('en-us')} >ENG</p>
                <p className="mx-3">|</p>
                <p className="cursor-pointer hover:font-bold" >ESP</p>
            </div>
        </div>
        <div className="w-screen z-10 fixed top-0 py-5 sm:hidden flex justify-between px-6">
            <Link href="/"><p className="text-2xl text-center">DAYUN</p></Link>
            <Menu size={28} />
        </div>
        </>
    )
}

export default TopNav