"use client";
import React, { useState } from "react";
import FilterItems from "./FilterItems";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
import usePropertyFilterStore from "@/store/usePropertyFilterStore";

const HeroContent = ({ propertyTypes }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const t = useTranslations('home');
  const { t: dynamicT } = useDynamicTranslations('listing');
  
  // Use store instead of local state
  const { advancedSearchVisible, setAdvancedSearchVisible } = usePropertyFilterStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: "buy", label: t("buy"), type: "sale" },
    { id: "rent", label: t("rent"), type: "rent" },
  ];

  return (
    <div className="advance-search-tab mt60 mt30-lg mx-auto animate-up-3">
      <ul className="nav nav-tabs p-0 m-0 border-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
              style={{
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #000000' : 'none'
              }}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            <div className="advance-content-style1 at-home8">
              <div className="row">
                <FilterItems
                  listingType={tab.type}
                  propertyTypes={propertyTypes}
                  ref={(filterItemsRef) => {
                    // เก็บ ref ของ FilterItems ไว้ใน tab object
                    if (filterItemsRef) {
                      tab.filterItemsRef = filterItemsRef;
                    }
                  }}
                />



                <div className="col-md-12">

                  <div className="d-bloc mt-3 mt-md-0 mb15">
                    <button
                      className="advance-search-btn"
                      type="button"
                      onClick={() => setAdvancedSearchVisible(true)}
                    >
                      <span className="flaticon-settings" /> {dynamicT('advanced', 'Advanced')}
                    </button>{" "}
                  </div>




                  <div className="d-grid">
                    <button
                      className="ud-btn btn-thm "
                      style={{
                        backgroundColor: '#000',
                        borderColor: '#000',
                      }}
                      type="button"
                      onClick={() => {
                        // เรียกใช้ฟังก์ชัน handleSearch โดยตรงจาก FilterItems
                        if (tab.filterItemsRef && typeof tab.filterItemsRef.handleSearch === 'function') {
                          tab.filterItemsRef.handleSearch();
                        } else {
                          // ถ้าไม่มี ref หรือไม่มีฟังก์ชัน handleSearch ให้นำทางไปยังหน้า properties/list โดยตรง
                          router.push(`/properties/list?type=${tab.type}`);
                        }
                      }}
                    >
                      <span className="flaticon-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
