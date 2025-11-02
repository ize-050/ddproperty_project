import { Suspense } from 'react'
import serverApi from '@/utils/serverApi'
import PropertyDetailThree from '@/components/properties/detail-three/PropertyDetailThree'
import LoadingAnimation from '@/components/common/LoadingAnimation'

// Force dynamic rendering
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamic = 'force-dynamic'

// Generate metadata
export async function generateMetadata({ params }) {
  const { id, locale } = params

  try {
    const property = await getPropertyById(id)

    if (!property) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.'
      }
    }

    // Get localized title
    let propertyTitle = property?.title || ''
    try {
      const translatedTitles = JSON.parse(property?.translatedTitles || '{}')
      propertyTitle = translatedTitles[locale] || translatedTitles['en'] || property?.title || ''
    } catch {
      propertyTitle = property?.title || ''
    }

    // Get localized description
    let description = ''
    try {
      const translatedDescriptions = JSON.parse(property?.translatedDescriptions || '{}')
      description = translatedDescriptions[locale] || translatedDescriptions['en'] || property?.description || ''
    } catch {
      description = property?.description || ''
    }

    const baseUrl = 'https://www.d-luckproperty.com'
    const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`
    const propertyUrl = `${localizedUrl}/property-detail-three/${id}`

    return {
      title: `${propertyTitle} | D'LuckProperty`,
      description: description.substring(0, 160),
      openGraph: {
        title: propertyTitle,
        description: description.substring(0, 160),
        url: propertyUrl,
        siteName: "D'LuckProperty",
        images: [
          {
            url: property?.mainImage || `${baseUrl}/images/logo.png`,
            width: 1200,
            height: 630,
            alt: propertyTitle,
          },
        ],
        locale: locale,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: propertyTitle,
        description: description.substring(0, 160),
        images: [property?.mainImage || `${baseUrl}/images/logo.png`],
      },
      alternates: {
        canonical: propertyUrl,
        languages: {
          'th': `${baseUrl}/property-detail-three/${id}`,
          'en': `${baseUrl}/en/property-detail-three/${id}`,
          'zh': `${baseUrl}/zh/property-detail-three/${id}`,
          'ru': `${baseUrl}/ru/property-detail-three/${id}`,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Property Detail | D\'LuckProperty',
      description: 'View property details'
    }
  }
}

// Fetch property data
async function getPropertyById(id) {
  try {
    const response = await serverApi.get(`/properties/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

// Main page component
export default async function PropertyDetailThreePage({ params }) {
  const { id } = params

  try {
    const property = await getPropertyById(id)

    if (!property) {
      return (
        <div className="error-page d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1>404</h1>
            <h3>Property Not Found</h3>
            <p>The property you are looking for does not exist.</p>
          </div>
        </div>
      )
    }

    return (
      <Suspense fallback={<LoadingAnimation />}>
        <PropertyDetailThree propertyData={property} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error loading property:', error)
    return (
      <div className="error-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1>Error</h1>
          <h3>Something went wrong</h3>
          <p>Unable to load property details. Please try again later.</p>
        </div>
      </div>
    )
  }
}
