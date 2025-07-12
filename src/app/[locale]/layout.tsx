import { NextIntlClientProvider, useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import Link from "next/link";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import TopNav from "./topNav";
import BottomNav from "./bottomNav";
export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <TopNav />
            {children}
            <BottomNav />
        </NextIntlClientProvider>
    );
}
