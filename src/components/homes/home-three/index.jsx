import HeroBanner from "./HeroBanner"
import WelcomeSection from "./WelcomeSection"
import BLockFeatureOne from "./BLockFeatureOne"
import FeaturedListing from "./FeaturedListing"
import PropertyTypes from "./PropertyTypes"
import PopularListings from "./PopularListings"
import PopularLocation from "./PopularLocation"
import OurBlog from "./OurBlog"
import FooterHomeThree from "./FooterHomeThree"
import HeaderTwo from "../../../layouts/headers/HeaderTwo"
import TranslationInitializer from '@/components/Translation/page'

const HomeThree = ({ locale, randomProperties = [], homeTranslations = {}, zones = [] }) => {
  return (
    <>
      <TranslationInitializer translations={homeTranslations} locale={locale} section="home">
        <HeaderTwo style_1={true} style_2={false} />
        <HeroBanner />
        <WelcomeSection />
        <BLockFeatureOne />
        <div className="container mt-50">
          <FeaturedListing randomProperties={randomProperties} />
        </div>
        <PropertyTypes />
        <PopularLocation zones={zones} />
        <OurBlog />
        <FooterHomeThree />
      </TranslationInitializer>
    </>
  )
}

export default HomeThree
