"use client"
import { useTranslations } from "next-intl"

const WelcomeSection = () => {
  const t = useTranslations("home.welcome")

  return (
    <section className="pb0  pt60" style={{
        paddingBottom: "0px"
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Main Title */}
            <div className="main-title text-center mb40">
              <h2 className="title fz55">
                Welcome to <span style={{ color: '#AF1A1E' }}>12 Real Estate</span> Pattaya
              </h2>
            </div>

            {/* Main Description */}
            <div className="mb40">
              <p className="text fz15 lh-2">
                {t("intro")}
              </p>
            </div>

            {/* Section 1: Buy, Sell & Rent */}
            <div className="mb30">
              <h4 className="title fz18 mb15">{t("section1Title")}</h4>
              <p className="text fz15 lh-2">
                {t("section1Description")}
              </p>
            </div>

            {/* Section 2: Investment Opportunities */}
            <div className="mb30">
              <h4 className="title fz18 mb15">{t("section2Title")}</h4>
              <p className="text fz15 lh-2">
                {t("section2Description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection
