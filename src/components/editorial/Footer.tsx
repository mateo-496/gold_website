import { getTranslations } from 'next-intl/server';

export async function Footer() {
    const t = await getTranslations('footer');

    return (
        <footer data-logo-hide="true" className="border-t border-neutral-200 py-8 snap-end">
            <div className="mx-auto max-w-2xl px-6 flex flex-col items-center gap-4">
                <a
                    href="mailto:contact@orcompare.com"
                    className="font-serif text-sm text-neutral-500 hover:text-neutral-900 transition-colors"            
                >
                    contact@orcompare.com
                </a>
                <p className="text-xs text-neutral-400 text-center max-w-2xl">
                    {t('disclaimer')}
                </p>
            </div> 
        </footer>
    )
}