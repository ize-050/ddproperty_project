"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const t = useTranslations('backoffice');

  // Extract path without locale (e.g., /th/backoffice/dashboard -> /backoffice/dashboard)
  const getPathWithoutLocale = (path) => {
    const segments = path.split('/');
    // Remove locale segment (th, en, zh, ru)
    if (segments.length > 1 && ['th', 'en', 'zh', 'ru'].includes(segments[1])) {
      return '/' + segments.slice(2).join('/');
    }
    return path;
  };

  const currentPath = getPathWithoutLocale(pathname);

  // Check if menu item is active
  const isActive = (href) => {
    if (href === "/backoffice/" || href === "/backoffice") {
      return currentPath === "/backoffice" || currentPath === "/backoffice/";
    }
    return currentPath === href;
  };

  const sidebarItems = [
    {
      title: t("menu.main"),
      items: [
        {
          href: "/backoffice/",
          icon: "dashboard",
          text: t("menu.dashboard"),
        },
        {
          href: "/backoffice/message",
          icon: "message",
          text: t("menu.message"),
        },
      ],
    },
    {
      title:  t("menu.managelisting"),
      items: [
        {
          href: "/backoffice/add-property",
          icon: "addproperty",
          text: t("menu.addproperty"),
        },
        {
          href: "/backoffice/my-properties",
          icon: "myproperty",
          text: t("menu.my_properties"),
        },
      ],
    },
    {
      title: t("menu.allpost"),
      items: [
        {
          href: "/backoffice/blog/add",
          icon: "addpost",
          text: t("menu.addnewpost"),
        },
        {
          href: "/backoffice/blog",
          icon: "allpost",
          text: t("menu.allpost"),
        },
      ],
    },
    {
      title: t("menu.setting"),
      items: [
        {
          href: "/backoffice/all-user",
          icon: "allusers",
          text: t("menu.alluser"),
        },
        {
          href: "/backoffice/language",
          icon: "language",
          text: t("menu.language"),
        },
        {
          href: "/backoffice/currency",
          icon: "currency",
          text: t("menu.currency"),
        },
      ],
    },
    {
      title: t("menu.profile"),
      items: [
        {
          href: "/backoffice/my-profile",
          icon: "myprofile",
          text: t("menu.myprofile"),
        },
      ],
    },
  ];

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <style jsx global>{`
        .sidebar-menu-item {
          position: relative;
        }
        
        .sidebar-icon-container {
          position: relative;
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 15px;
        }
        
        .sidebar-icon-dark, .sidebar-icon-light {
          position: absolute;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
        }
        
        .sidebar-icon-light {
          display: none;
        }
        
        .sidebar-icon-dark {
          display: block;
        }
        
        /* Hover state: show light, hide dark */
        .sidebar_list_item:hover .sidebar-icon-dark {
          display: none !important;
        }
        
        .sidebar_list_item:hover .sidebar-icon-light {
          display: block !important;
        }
        
        /* Active state: always show light, hide dark */
        .sidebar-menu-item.-is-active .sidebar-icon-dark {
          display: none !important;
        }
        
        .sidebar-menu-item.-is-active .sidebar-icon-light {
          display: block !important;
        }
      `}</style>
      <div className="dashboard_sidebar_list" style={{
        fontSize: "14px",
        paddingTop: "50px"
      }}>
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p
              className={`fz15 fw400 ff-heading ${
                sectionIndex === 0 ? "mt-0" : "mt30"
              }`}
            >
              {section.title}
            </p>
            {section?.items?.map((item, itemIndex) => {
              const isItemActive = isActive(item.href);
              const darkIconPath = `/images/icons/dark/${item.icon}.svg`;
              const lightIconPath = `/images/icons/light/${item.icon}.svg`;
              
              return (
                <div key={itemIndex} className="sidebar_list_item">
                  {item.href === "#" ? (
                    <button onClick={item.onClick} className={`items-center sidebar-menu-item`}>
                      <div className="sidebar-icon-container">
                        <Image
                          src={darkIconPath}
                          alt={item.text}
                          width={16}
                          height={16}
                          className="sidebar-icon-dark"
                        />
                        <Image
                          src={lightIconPath}
                          alt={item.text}
                          width={16}
                          height={16}
                          className="sidebar-icon-light"
                        />
                      </div>
                      {item.text}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`items-center sidebar-menu-item ${
                        isItemActive ? "-is-active" : ""
                      } `}
                    >
                      <div className="sidebar-icon-container">
                        <Image
                          src={darkIconPath}
                          alt={item.text}
                          width={16}
                          height={16}
                          className="sidebar-icon-dark"
                        />
                        <Image
                          src={lightIconPath}
                          alt={item.text}
                          width={16}
                          height={16}
                          className="sidebar-icon-light"
                        />
                      </div>
                      {item.text}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
