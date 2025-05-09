"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '@/components/home/home/Header';
import MobileMenu from '@/components/common/mobile-menu';
import Footer from '@/components/home/home/footer/';
import ScrollToTop from '@/components/common/ScrollTop';
// import PropertyFiltering from "@/components/pages/listing/grid-view/grid-full-4-col/PropertyFiltering";
import HeroSearchBar from './HeroSearchBar';
import usePropertyFilterStore from '@/store/usePropertyFilterStore';
import PropertyFilter from './PropertyFilter';
import useZoneStore from '@/store/useZoneStore';
import LoadingAnimation from '@/components/common/LoadingAnimation';
import PropertyFilteringSuspense from './PropertyFilteringSuspense';

// Import custom styles
import '@/styles/property-listing.scss';
import '@/styles/property-listing-search.scss';

// Property Cards Skeleton component for loading state


const ListingPropertiesPage = ({ properties = [], pagination = {}, zones = [], searchParams = {} }) => {
  const t = useTranslations('PropertyList');
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const setZones = useZoneStore(state => state.setZones);
  const propertyItems = usePropertyFilterStore(state => state.propertyItems);
  const setPropertyItems = usePropertyFilterStore(state => state.setPropertyItems);
  const setPaginationItems = usePropertyFilterStore(state => state.setPaginationItems);
  const paginationItems = usePropertyFilterStore(state => state.paginationItems);
  const filterStore = usePropertyFilterStore();

  // filters state (single source of truth)
  const [filters, setFilters] = useState({
    propertyType: filterStore.propertyType || '',
    minPrice: filterStore.minPrice || 0,
    maxPrice: filterStore.maxPrice || 15000000,
    zoneId: filterStore.zoneId || '',
    listingType: 'SALE',
    bedrooms: filterStore.bedrooms || '',
    bathrooms: filterStore.bathrooms || '',
    page: searchParams.page || 1,
    limit: searchParams.limit || 9
  });

  useEffect(() => {
    // เมื่อ component mount หรือมีการเปลี่ยนแปลง zones
    if (zones && zones.length > 0) {
      setZones(zones);
    }
    setIsLoading(false);
  }, [zones, setZones, properties]);


  useEffect(() => {
    setPropertyItems(properties)
    setPaginationItems(pagination)
  }, [properties])




  const handleSearch = (filterValues) => {
    setFilters((prev) => ({
      ...prev,
      ...filterValues
    }));
    // TODO: call API fetch/filter here if needed
  };

  const handlePageChange = (page) => {
    // ป้องกันการเปลี่ยนหน้าที่ไม่จำเป็น
    if (page === currentPage) return;

    setCurrentPage(page);
    setIsLoading(true); // เริ่ม loading state

    // สร้าง URL params ใหม่
    const params = new URLSearchParams(searchParamsObj.toString());
    params.set('page', page.toString());

    // นำทางไปยัง URL ใหม่
    router.push(`${pathname}?${params.toString()}`);
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

  // ฟังก์ชันสำหรับอัปเดตการกรอง
  const handleFilterChange = (newFilters) => {
    setIsLoading(true); // เริ่ม loading state

    const updatedFilters = { ...filters, ...newFilters, page: 1 }; 
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  // ฟังก์ชันสำหรับอัปเดต  // เมื่อมีการเปลี่ยนแปลง filters  
  const handleFilterChange2 = () => {
    setIsLoading(true); // เริ่ม loading state

    // สร้าง URL params ใหม่
    const params = new URLSearchParams();

    // เพิ่ม params ที่มีค่า
    if (selectedZone) params.set('zoneId', selectedZone);
    if (selectedPropertyType) params.set('propertyType', selectedPropertyType);
    if (selectedListingType) params.set('listingType', selectedListingType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortOrder) params.set('sort', sortOrder);

    // รีเซ็ตหน้าเป็น 1 เมื่อมีการเปลี่ยน filter
    params.set('page', '1');
    setCurrentPage(1);

    // นำทางไปยัง URL ใหม่
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Header />

      <MobileMenu />

      <div className="main-content ">
        <div className="banner-wrapper">
          <div className="container">
            <div className="hero-banner">
              <div className="banner-content">
                <h1 className="text-white">Find Your Dream Home</h1>
                <p className="text-white">We've more than 1,000+ properties listed on our website</p>
              </div>

              <HeroSearchBar onSearch={handleSearch} zones={zones} />
            </div>
          </div>
        </div>
      </div>

      <section className="our-listing pb30-991 pt50"
        style={{ backgroundColor: '#f9f6f9' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-title text-center mb40">
                <h2>{t('discoverOurFeaturedListings')}</h2>
              </div>
            </div>
          </div>



          <div className="row">
            {/* Property Listings - Full Width 4 Columns */}
            <div className="col-lg-12">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="row">
                    {isLoading ? (
                      <div className="col-12">
                        <div style={{ minHeight: 240 }}><LoadingAnimation /></div>
                      </div>
                    ) : (
                      propertyItems && propertyItems.length > 0 ? (
                        propertyItems.map((property) => (
                          <div className="col-sm-6 col-md-6 col-lg-4 mb-4" key={property.id}>
                            <PropertyFilteringSuspense property={property} />
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center">ไม่พบข้อมูล</div>
                      )
                    )}
                  </div>
                </div>

                <div className="col-12 text-center mt-4 mb-5">
                  <div className="results-count">
                    <p>1-{propertyItems.length} of {paginationItems?.total || 0} property available</p>
                  </div>

                  <div className="simple-pagination">
                    <button
                      className="page-nav prev"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(parseInt(paginationItems?.page || 1) - 1);
                      }}
                      disabled={parseInt(paginationItems?.page || 1) <= 1 || paginationItems?.pages <= 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {/* แสดงปุ่มหมายเลขหน้าตามจำนวนหน้าที่มีจริง */}
                    {[...Array(Math.max(1, paginationItems?.pages || 1))].map((_, i) => (
                      <button
                        key={i}
                        className={`page-number ${parseInt(paginationItems?.page || 1) === i + 1 ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="page-nav next"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(parseInt(paginationItems?.page || 1) + 1);
                      }}
                      disabled={parseInt(paginationItems?.page || 1) >= paginationItems?.pages || paginationItems?.pages <= 1}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default ListingPropertiesPage;
