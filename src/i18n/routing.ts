import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 

export const locales = ["en-us", "es"] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,
 
  // Used when no locale matches
  defaultLocale: 'es'
});

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    'es': 'ES',
    'en-us': 'EN'
};
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);