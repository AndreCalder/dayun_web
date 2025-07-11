"use client";
import Link from 'next/link';
import React from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

function BottomNav() {

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
        <div className="w-screen hidden fixed bottom-0 py-5 md:grid grid-cols-3">
            <Link href="/"><p className="text-2xl text-center">{t("shop")}</p></Link>
            <Link href="/"><p className="text-2xl text-center">{t("catalog")}</p></Link>
            <Link href="/"><p className="text-2xl text-center">{t("contact")}</p></Link>
        </div>
    )
}

export default BottomNav

