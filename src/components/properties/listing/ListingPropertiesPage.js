"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '@/components/home/home/Header';
import MobileMenu from '@/components/common/mobile-menu';
import Footer from '@/components/home/home/footer/';
import ScrollToTop from '@/components/common/ScrollTop';
import PropertyFiltering from "@/components/listing/grid-view/grid-full-4-col/PropertyFiltering";
import PropertyFilter from './PropertyFilter';
import useZoneStore from '@/store/useZoneStore';

const ListingPropertiesPage = ({ properties = [], pagination = {}, zones = [], searchParams = {} }) => {
  const t = useTranslations('PropertyList');
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();

  useEffect(() => {
    console.log('properties11', properties);
  }, [properties]);

  // ใช้ useState และ useEffect เพื่อแก้ไขปัญหา hydration error
  const [isClient, setIsClient] = useState(false);

  // เก็บข้อมูล Zone ใน Zustand store
  const setZones = useZoneStore(state => state.setZones);

  // สร้าง state สำหรับเก็บค่าการกรอง
  const [filters, setFilters] = useState({
    propertyType: searchParams.propertyType || '',
    minPrice: searchParams.minPrice || 500000,
    maxPrice: searchParams.maxPrice || 20000000,
    zoneId: searchParams.zoneId || '',
    listingType: searchParams.listingType || 'SALE',
    bedrooms: searchParams.bedrooms || '',
    bathrooms: searchParams.bathrooms || '',
    page: searchParams.page || 1,
    limit: searchParams.limit || 9
  });

  useEffect(() => {
    setIsClient(true);

    // เมื่อ component mount ให้นำข้อมูล zones ไปเก็บใน store
    if (zones && zones.length > 0) {
      setZones(zones);
    }
  }, [zones, setZones]);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // ฟังก์ชันสำหรับอัปเดตการกรอง
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // รีเซ็ตหน้าเป็น 1 เมื่อเปลี่ยนการกรอง
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  // ฟังก์ชันสำหรับอัปเดต URL ตามการกรอง
  const updateURL = (filters) => {
    const queryParams = new URLSearchParams();

    // เพิ่มพารามิเตอร์ต่างๆ ที่มีค่า
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    // อัปเดต URL โดยไม่ต้อง refresh หน้า
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  return (
    <>
      {/* Main Header Nav */}
      <Header />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb style2">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="breadcrumb_content">
                <h2 className="breadcrumb_title">{t('propertyListings')}</h2>
                {/* <p>{t('findYourDreamProperty')}</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Grid View */}
      <section className="our-listing bgc-f7 pb30-991 pt100-360">
        <div className="container">
          <div className="row">
            {/* Sidebar Filter */}
            <div className="col-lg-4 col-xl-4">
              <PropertyFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Property Listings */}
            <div className="col-lg-8 col-xl-8">
              <div className="row">
                <div className="col-lg-12">
                  <div className="listing_heading">
                    <h4>{t('foundResults', { count: pagination.total || 0 })}</h4>
                  </div>
                </div>

                {/* Property Cards */}
                {properties && properties.length > 0 ? (
                  properties.map((property) => (
                    <div className="col-md-6 col-lg-6" key={property.id}>
                      <PropertyFiltering property={property} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    {/* <h3>{t('noPropertiesFound')}</h3>
                    <p>{t('tryDifferentFilters')}</p> */}
                  </div>
                )}

                {/* Pagination */}
                {/* {pagination && pagination.pages > 1 && (
                  <div className="col-lg-12">
                    <div className="mbp_pagination mt20">
                      <Pagination
                        currentPage={parseInt(pagination.page) || 1}
                        totalPages={pagination.pages || 1}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll To Top */}
      <ScrollToTop />
    </>
  );
};

export default ListingPropertiesPage;
