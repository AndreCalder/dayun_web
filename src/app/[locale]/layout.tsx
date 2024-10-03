import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Link from 'next/link';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const homepageData = messages['HomePage'] as { about: string, shop: string, catalog: string, contact: string };
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
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                <div className="w-screen z-10 fixed top-0 py-5 grid grid-cols-3">
                        <Link href="/"><p className="text-2xl text-center">{homepageData.about}</p></Link>
                        <Link href="/"><p className="text-2xl text-center">DAYUN</p></Link>
                        <div className="flex justify-center">
                            <p className="cursor-pointer hover:font-bold" onClick={() => changeLocale('en-us')} >ENG</p>
                            <p className="mx-3">|</p>
                            <p className="cursor-pointer hover:font-bold" >ESP</p>
                        </div>
                    </div>
                    {children}
                    <div className="w-screen fixed bottom-0 py-5 grid grid-cols-3">
                        <Link href="/"><p className="text-2xl text-center">{homepageData.shop}</p></Link>
                        <Link href="/"><p className="text-2xl text-center">{homepageData.catalog}</p></Link>
                        <Link href="/"><p className="text-2xl text-center">{homepageData.contact}</p></Link>
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}