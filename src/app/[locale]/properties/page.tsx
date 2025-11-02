import PropertiesList from "@/components/properties/PropertiesList"
import Wrapper from "@/layouts/Wrapper"

export const metadata = {
  title: "Properties - 12 Real Estate Pattaya",
  description: "Browse our collection of properties for sale and rent in Pattaya"
}

const PropertiesPage = async ({ params, searchParams }) => {
  const locale = params?.locale || 'en'

  return (
    <Wrapper>
      <PropertiesList locale={locale} searchParams={searchParams} />
    </Wrapper>
  )
}

export default PropertiesPage
