'use client';

import { useEffect, useState } from 'react';
import HeaderWithLanguage from "./HeaderWithLanguage";
import LanguageApi from "@/utils/languageApi";

/**
 * Client component that fetches UI strings and renders HeaderWithLanguage
 * This is the main Header component that should be used throughout the application
 */
export default function HeaderSSR() {
  const [headerStrings, setHeaderStrings] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchHeaderStrings() {
      try {
        // Fetch UI strings on the client
        const response = await LanguageApi.getUiStringsBySection('header', { 
          serverSide: false
        });
        
        if (response.success) {
          const strings = response.data.reduce((acc, item) => {
            acc[item.slug] = {
              en: item.en,
              th: item.th,  
              cn: item.zhCN,
              ru: item.ru
            };
            return acc;
          }, {});
          
          setHeaderStrings(strings);
        }
      } catch (error) {
        console.error('Error fetching header strings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHeaderStrings();
  }, []);
  
  // Pass the fetched strings to the HeaderWithLanguage component
  return <HeaderWithLanguage initialStrings={headerStrings} />;
}
