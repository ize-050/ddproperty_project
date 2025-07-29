'use client'

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';

const PropertyBreadcrumb = ({ property }) => {
  const { t: dynamicT } = useSimpleTranslations('listing');
  const locale = useLocale();
  
  return (
    <div className="breadcrumb-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href={`/${locale !== 'th' ? locale : ''}`}>
                    {dynamicT('home', 'Home')}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/${locale !== 'th' ? locale + '/' : ''}properties/list`}>
                    {dynamicT('property', 'Properties')}
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {property.projectName || property.title || 'Property Detail'}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyBreadcrumb;
