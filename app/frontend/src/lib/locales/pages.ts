// Aggregated translations for secondary/advanced pages.
// Merged into the main dictionaries by i18n.ts; English acts as the fallback.
import { pagesEn, type PageDict } from './pages-en';
import { pagesFr } from './pages-fr';
import { pagesEs } from './pages-es';
import { pagesPt } from './pages-pt';
import { pagesZh } from './pages-zh';
import { pagesAr } from './pages-ar';
import { pagesRu } from './pages-ru';

export type { PageDict };

export const pages: Record<string, PageDict> = {
  en: pagesEn,
  ar: pagesAr,
  zh: pagesZh,
  ru: pagesRu,
  fr: pagesFr,
  pt: pagesPt,
  es: pagesEs,
};