"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

const logo = "/assets/images/logo/logo_01.svg";

const NavMenu = ({ getString }) => {
    const pathname = usePathname();
    const currentRoute = usePathname();
    const locale = useLocale();
    const t = getString || useTranslations();
    const [navTitle, setNavTitle] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);



    // Hardcoded menu items (same as MainMenu)
    useEffect(() => {
        setMenuItems([
            { id: "home", title: t("home"), link: `/${locale !== 'th' ? locale + '/' : ''}` },
            { id: "forSale", title: t('buy'), link: `/${locale !== 'th' ? locale + '/' : ''}properties?type=sale` },
            { id: "forRent", title: t('rent'), link: `/${locale !== 'th' ? locale + '/' : ''}properties?type=rent` },
            { id: "blog", title: t('blog'), link: `/${locale !== 'th' ? locale + '/' : ''}blog` },
            { id: "about", title: t('about'), link: `/${locale !== 'th' ? locale + '/' : ''}about` },
            { id: "contact", title: t('contact'), link: `/${locale !== 'th' ? locale + '/' : ''}contact` },
        ]);
        setLoading(false);
    }, [locale, getString]);

    const openMobileMenu = (menu) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    if (loading) {
        return (
            <ul className="navbar-nav align-items-lg-center">
                <li className="d-block d-lg-none"><div className="logo"><Link href="/" className="d-block"><img src={logo} alt="" /></Link></div></li>
                {Array(5).fill(0).map((_, index) => (
                    <li key={`loading-${index}`} className="nav-item">
                        <span className="nav-link">Loading...</span>
                    </li>
                ))}
            </ul>
        );
    }


    

    return (
        <ul className="navbar-nav align-items-lg-center">
            <li className="d-block d-lg-none"><div className="logo"><Link href="/" className="d-block"><img src={logo} alt="" /></Link></div></li>
            {menuItems.map((menu) => (
                <li key={menu.id} className="nav-item">
                    <Link href={menu.link} className={`nav-link ${pathname === menu.link ? 'active' : ''}`}>
                        {menu.icon && <i className={menu.icon}></i>}
                        {menu.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;

