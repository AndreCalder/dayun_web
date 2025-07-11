import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Link from 'next/link';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import TopNav from './topNav';
import BottomNav from './bottomNav';
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

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <TopNav />
                    {children}
                    <BottomNav />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}