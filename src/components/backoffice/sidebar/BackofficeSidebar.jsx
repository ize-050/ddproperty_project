"use client";
import Link from "next/link";
import React from "react";
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
          icon: "flaticon-protection",
          text: t("menu.dashboard"),
        },
        {
          href: "/backoffice/message",
          icon: "flaticon-user",
          text: t("menu.message"),
        },
      ],
    },
    {
      title:  t("menu.managelisting"),
      items: [
        {
          href: "/backoffice/add-property",
          icon: "flaticon-protection",
          text: t("menu.addproperty"),
        },
        {
          href: "/backoffice/my-properties",
          icon: "flaticon-user",
          text: t("menu.my_properties"),
        },
      ],
    },
    {
      title: t("menu.allpost"),
      items: [
        {
          href: "/backoffice/blog/add",
          icon: "flaticon-protection",
          text: t("menu.addnewpost"),
        },
        {
          href: "/backoffice/blog",
          icon: "flaticon-user",
          text: t("menu.allpost"),
        },
      ],
    },
    {
      title: t("menu.setting"),
      items: [
        {
          href: "/backoffice/all-user",
          icon: "flaticon-protection",
          text: t("menu.alluser"),
        },
        {
          href: "/backoffice/language",
          icon: "flaticon-user",
          text: t("menu.language"),
        },
        {
          href: "/backoffice/currency",
          icon: "flaticon-user",
          text: t("menu.currency"),
        },
      ],
    },
    {
      title: t("menu.profile"),
      items: [
        {
          href: "/backoffice/my-profile",
          icon: "flaticon-protection",
          text: t("menu.myprofile"),
        },
      ],
    },
  ];

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
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
            {section?.items?.map((item, itemIndex) => (
              <div key={itemIndex} className="sidebar_list_item">
                {item.href === "#" ? (
                  <button onClick={item.onClick} className={`items-center `}>
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`items-center   ${
                      isActive(item.href) ? "-is-active" : ""
                    } `}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
