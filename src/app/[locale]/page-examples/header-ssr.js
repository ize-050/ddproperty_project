import HeaderWithLanguage from "@/components/home/home/HeaderWithLanguage";
import LanguageApi from "@/utils/languageApi";

/**
 * Server component that fetches UI strings and passes them to the client component
 * This demonstrates how to use SSR with our language API
 */
export default async function HeaderSSRExample() {
  // Fetch UI strings on the server
  const response = await LanguageApi.getUiStringsBySection('header', { 
    serverSide: true,
    // Cache for 1 hour by default, can be customized
    next: { revalidate: 3600 }
  });
  
  // Transform array of strings to object with slug as key for easier access in the client component
  const headerStrings = response.success 
    ? response.data.reduce((acc, item) => {
        acc[item.slug] = {
          en: item.en,
          th: item.th,
          zhCN: item.zhCN,
          ru: item.ru
        };
        return acc;
      }, {})
    : {};
  
  // Pass the pre-fetched strings to the client component
  return <HeaderWithLanguage initialStrings={headerStrings} />;
}
