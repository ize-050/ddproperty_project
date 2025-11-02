import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";

const MainMenu = ({getString}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenuItems = async () => {
        setMenuItems([
          { id: "home", label: getString("home"), href: '/' + locale + '/' },
          { id: "forSale", label: getString('buy'), href: '/' + locale + '/properties/list?type=sale' },
          { id: "forRent", label: getString('rent'), href: '/' + locale + '/properties/list?type=rent' },
          { id: "blog", label: getString('blog'), href: '/' + locale + '/blog' },
          { id: "about", label: getString('about'), href: '/' + locale + '/about' },
          { id: "contact", label: getString('contact'), href: '/' + locale + '/contact' },
        ]);
        setLoading(false)
    };

    fetchMenuItems();
  }, [locale, getString]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (href) => {
    closeMenu();
    router.push(href);
  };

  useEffect(()=>{
    console.log("MenuItems",menuItems);
  },[menuItems])

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <ul className="ace-responsive-menu">
      {loading ? (
        // Show loading placeholders
        Array(5).fill(0).map((_, index) => (
          <li key={`loading-${index}`} className="visible_list">
            <span className="menu-loading-placeholder"></span>
          </li>
        ))
      ) : (
        // Show actual menu items
        menuItems.map((item) => (
          <li key={item.id} className="visible_list">
            <Link href={item.href}>
              {item.icon && <i className={`fa ${item.icon} me-2`}></i>}
              {item.label}
            </Link>
          </li>
        ))
      )}
    </ul>
  );
};

export default MainMenu;
