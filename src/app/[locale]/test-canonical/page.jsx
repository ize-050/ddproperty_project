// Simple test page สำหรับทดสอบ canonical tag
export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const baseUrl = 'http://localhost:3000';
  const localizedUrl = locale === 'th' ? `${baseUrl}/test-canonical` : `${baseUrl}/${locale}/test-canonical`;

  return {
    title: 'Test Canonical Page',
    description: 'Test page for canonical URL validation',
    alternates: {
      canonical: localizedUrl,
    },
  };
}

export default function TestCanonicalPage({ params }) {
  const { locale } = params;
  
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test Canonical Page</h1>
      <p>Locale: {locale}</p>
      <p>This is a simple test page to validate canonical URL functionality.</p>
      <p>Check page source to see canonical tag.</p>
    </div>
  );
}
