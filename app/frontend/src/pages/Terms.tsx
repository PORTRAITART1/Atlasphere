import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { t, isRTL } from '@/lib/i18n';
import { useI18nRerender } from '@/lib/i18n';

export default function Terms() {
  useI18nRerender();
  const rtl = isRTL();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" dir={rtl ? 'rtl' : 'ltr'}>
      <Navbar />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-8 ${rtl ? 'text-right' : ''}`}>{t('terms.title')}</h1>
          <div className={`prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 ${rtl ? 'text-right' : ''}`}>
            <p className="text-sm text-gray-400">{t('terms.lastUpdate')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s1.title')}</h2>
            <p>{t('terms.s1.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s2.title')}</h2>
            <p>{t('terms.s2.intro')}</p>
            <ul className={`list-disc space-y-2 ${rtl ? 'pr-6' : 'pl-6'}`}>
              <li>{t('terms.s2.item1')}</li>
              <li>{t('terms.s2.item2')}</li>
              <li>{t('terms.s2.item3')}</li>
              <li>{t('terms.s2.item4')}</li>
              <li>{t('terms.s2.item5')}</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s3.title')}</h2>
            <p>{t('terms.s3.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s4.title')}</h2>
            <p>{t('terms.s4.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s5.title')}</h2>
            <p>{t('terms.s5.intro')}</p>
            <ul className={`list-disc space-y-2 ${rtl ? 'pr-6' : 'pl-6'}`}>
              <li>{t('terms.s5.item1')}</li>
              <li>{t('terms.s5.item2')}</li>
              <li>{t('terms.s5.item3')}</li>
              <li>{t('terms.s5.item4')}</li>
              <li>{t('terms.s5.item5')}</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s6.title')}</h2>
            <p>{t('terms.s6.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s7.title')}</h2>
            <p>{t('terms.s7.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s8.title')}</h2>
            <p>{t('terms.s8.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s9.title')}</h2>
            <p>{t('terms.s9.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s10.title')}</h2>
            <p>{t('terms.s10.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s11.title')}</h2>
            <p>{t('terms.s11.text')}</p>

            <h2 className="text-xl font-semibold text-white mt-8">{t('terms.s12.title')}</h2>
            <p>{t('terms.s12.text')}</p>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}