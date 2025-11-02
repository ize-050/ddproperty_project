"use client"
import NavMenu from "./Menu/NavMenu"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import dynamic from 'next/dynamic'
import UseSticky from "@/hooks/UseSticky"
import { useTranslations } from "next-intl"

import Offcanvas from "./Menu/Offcanvas"
import HeaderSearchbar from "./Menu/HeaderSearchbar"

const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
    ssr: false,
});

const CurrencySwitcher = dynamic(() => import("@/components/common/CurrencySwitcher"), {
    ssr: false,
});

const logo_1 = "/assets/images/logo/logo_02.svg";
const logo_2 = "/assets/images/logo/logo_04.svg";
const logo_3 = "/assets/images/logo/logo_06.svg";
const logo_weare = "/assets/images/logo/logoweare.png";

const HeaderTwo = ({ style_1, style_2 }) => {
   const { sticky } = UseSticky();
   const [offCanvas, setOffCanvas] = useState(false);
   const [isSearch, setIsSearch] = useState(false);
   const t = useTranslations('header');

   return (
      <>
         <div className={`theme-main-menu menu-overlay sticky-menu ${style_2 ? "menu-style-four" : style_1 ? "menu-style-three" : "menu-style-two"} ${sticky ? "fixed" : ""}`}>
            <div className={`inner-content ${style_2 ? "gap-two" : "gap-one"}`}>
               <div className="top-header position-relative">
                  <div className="d-flex align-items-center">
                     <div className="logo order-lg-0">
                        <Link href="/" className="d-flex align-items-center">
                           <Image src={logo_weare} alt="WeAre Property" width={120} height={60} style={{ objectFit: 'contain' }} />
                        </Link>
                     </div>

                     <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
                        <ul className="d-flex align-items-center style-none">
                           <li><LanguageSwitcher /></li>
                           <li><CurrencySwitcher /></li>
                           <li className="d-none d-md-inline-block ms-3">
                              <Link href="/backoffice/login" className={style_1 ? "btn-ten" : "btn-two rounded-0"}>
                                 <span>BACKOFFICE</span> <i className="fa-thin fa-arrow-up-right"></i>
                              </Link>
                           </li>
                        </ul>
                     </div>

                     <nav className="navbar navbar-expand-lg p0 ms-lg-5 order-lg-2">
                        <button className="navbar-toggler d-block d-lg-none" type="button" data-bs-toggle="collapse"
                           data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                           aria-label="Toggle navigation">
                           <span></span>
                        </button>
                        <div className={`collapse navbar-collapse ${style_2 ? "ms-xl-5" : ""}`} id="navbarNav">
                           <NavMenu getString={t} />
                        </div>
                     </nav>
                  </div>
               </div>
            </div>
         </div>

         <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
         <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
      </>
   )
}

export default HeaderTwo
