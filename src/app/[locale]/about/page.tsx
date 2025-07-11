"use client";

import React from 'react'
import { useTranslations } from 'next-intl';

function About() {

    const t = useTranslations('About');

    return (
        <div className='h-lvh w-lvw grid grid-cols-2 mx-20' >
            <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
                <div className='container mx-10'>
                    <h1 className='text-2xl underline underline-offset-8 pb-10'>{t("title")}</h1>
                    <p className='text-lg text-ellipsis whitespace-pre-wrap'>{t("t1")}</p>
                    <h1 className='text-4xl my-2'>ESTUDIODAYUN@GMAIL.COM</h1>
                    <p className="text-lg whitespace-pre-wrap">
                        {t("t2")}
                    </p>
                </div>
            </div>
            <div className="col-span-2 md:col-span-1">
                <div className="container mx-10">

                </div>
            </div>
        </div>
    )
}

export default About