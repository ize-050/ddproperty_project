"use client"
import { useTranslations } from 'next-intl';

const CoAgent = () => {
    const t = useTranslations('backoffice.coAgent');

    return (
        <div>
            <h2>{t('title')}</h2>
        </div>
    )
}