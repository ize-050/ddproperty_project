import {
  homeItems,
  blogItems,
  listingItems,
  propertyItems,
  pageItems,
} from "@/data/navItems";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const MainMenu = () => {
  const pathname = usePathname();
  const t = useTranslations('header');
  const [topMenu, setTopMenu] = useState("");
  const searchParams = useSearchParams();
  const [submenu, setSubmenu] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const typeParam = searchParams.get('type');

  const isActive = (href) => {
    if (pathname === href) return true;

    // ถ้าอยู่ที่หน้า properties/list ให้เช็ค type parameter
    if (pathname.includes('/properties/list')) {
      if (href.includes('type=sale') && typeParam === 'sale') return true;
      if (href.includes('type=rent') && typeParam === 'rent') return true;
    }

    return false;
  };


  const menuItems = [
    { id: "home", label: t("home"), href: "/" },
    { id: "forSale", label: t('buy'), href: "/properties/list?type=sale" },
    { id: "forRent", label: t('rent'), href: "/properties/list?type=rent" },
    { id: "blog", label: t('blog'), href: "/blog" },
    { id: "about", label: t('about'), href: "/about" },
    { id: "contact", label: t('contact'), href: "/contact" },
  ];



  const handleActive = (link) => {
    if (link.split("/")[1] == pathname.split("/")[1]) {
      return "menuActive";
    }
  };
  return (
    <ul className="ace-responsive-menu">

      {menuItems.map((item) => (
            <li key={item.id} className="visible_list">
              <Link
                href={item.href}
                className={isActive(item.href) ? 'active list-item' : 'list-item'}
              >
                {item.label}
              </Link>
            </li>
          ))}

    </ul>
  );
};

export default MainMenu;
