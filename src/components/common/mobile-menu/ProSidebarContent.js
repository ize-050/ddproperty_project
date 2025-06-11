import mobileMenuItems from "@/data/mobileMenuItems";
import { isParentActive } from "@/utilis/isMenuActive";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";

const ProSidebarContent = () => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations('header');

  const [activeMenu, setActiveMenu] = useState("home");
  
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


  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  component={
                    <Link
                      className={item.href == path ? "active" : ""}
                      href={item.href}
                    />
                  }
                >
                  {item.label}
                </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
