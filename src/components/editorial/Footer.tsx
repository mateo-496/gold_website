import { getTranslations } from 'next-intl/server';

export async function Footer() {
    const t = await getTranslations('footer');

    return (
        <footer className="border-t border-neutral-200 py-8 snap-end">
            <div className="mx-auto max_w_6xl px-6 flex justify-center">
                <a
                    href="mailto:contact@orcompare.com"
                    className="font-serif text-sm text-neutral-500 hover:text-neutral-900 transition-colors"            
                >
                    contact@orcompare.com
                </a>
                <p className="text-xs text-neutral-400 text-center max-w-2xl mt-4">
                    {t('disclaimer')}
                </p>
            </div> 
        </footer>
    )
}