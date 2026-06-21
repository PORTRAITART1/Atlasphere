import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { t, isRTL } from '@/lib/i18n';
import { useI18nRerender } from '@/lib/i18n';

export default function Privacy() {
  useI18nRerender();
  const rtl = isRTL();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" dir={rtl ? 'rtl' : 'ltr'}>
      <Navbar />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-8 ${rtl ? 'text-right' : ''}`}>{t('privacy.title')}</h1>
          <div className={`prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 ${rtl ? 'text-right' : ''}`}>
            <p className="text-sm text-gray-400">{t('privacy.lastUpdate')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s1.title')}</h2>
            <p>{t('privacy.s1.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s2.title')}</h2>
            <p>{t('privacy.s2.intro')}</p>
            <ul className={`list-disc space-y-2 ${rtl ? 'pr-6' : 'pl-6'}`}>
              <li>{t('privacy.s2.item1')}</li>
              <li>{t('privacy.s2.item2')}</li>
              <li>{t('privacy.s2.item3')}</li>
              <li>{t('privacy.s2.item4')}</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s3.title')}</h2>
            <p>{t('privacy.s3.intro')}</p>
            <ul className={`list-disc space-y-2 ${rtl ? 'pr-6' : 'pl-6'}`}>
              <li>{t('privacy.s3.item1')}</li>
              <li>{t('privacy.s3.item2')}</li>
              <li>{t('privacy.s3.item3')}</li>
              <li>{t('privacy.s3.item4')}</li>
              <li>{t('privacy.s3.item5')}</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s4.title')}</h2>
            <p>{t('privacy.s4.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s5.title')}</h2>
            <p>{t('privacy.s5.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s6.title')}</h2>
            <p>{t('privacy.s6.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s7.title')}</h2>
            <p>{t('privacy.s7.intro')}</p>
            <ul className={`list-disc space-y-2 ${rtl ? 'pr-6' : 'pl-6'}`}>
              <li>{t('privacy.s7.item1')}</li>
              <li>{t('privacy.s7.item2')}</li>
              <li>{t('privacy.s7.item3')}</li>
              <li>{t('privacy.s7.item4')}</li>
              <li>{t('privacy.s7.item5')}</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s8.title')}</h2>
            <p>{t('privacy.s8.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('privacy.s9.title')}</h2>
            <p>{t('privacy.s9.text')}</p>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}