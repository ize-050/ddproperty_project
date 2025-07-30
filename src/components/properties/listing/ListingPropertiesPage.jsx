"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import PropertyFiltering from "@/components/pages/listing/grid-view/grid-full-4-col/PropertyFiltering";
import HeroSearchBar from './HeroSearchBar';
import usePropertyFilterStore from '@/store/usePropertyFilterStore';
import PropertyFilter from './PropertyFilter';
import useZoneStore from '@/store/useZoneStore';
import LoadingAnimation from '@/components/common/LoadingAnimation';
import PropertyFilteringSuspense from './PropertyFilteringSuspense';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';


// Import custom styles
import '@/styles/property-listing.scss';
import '@/styles/property-listing-search.scss';

// Property Cards Skeleton component for loading state


const ListingPropertiesPage = ({ properties = [], pagination = {}, zones = [], searchParams = {} }) => {
  const t = useTranslations('PropertyList');
  const { t: dynamicT } = useSimpleTranslations('listing');
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page) || 1);
  const setZones = useZoneStore(state => state.setZones);
  const propertyItems = usePropertyFilterStore(state => state.propertyItems);
  const setPropertyItems = usePropertyFilterStore(state => state.setPropertyItems);
  const setPaginationItems = usePropertyFilterStore(state => state.setPaginationItems);
  const paginationItems = usePropertyFilterStore(state => state.paginationItems);
  const {advancedSearchVisible,setAdvancedSearchVisible} = usePropertyFilterStore();

  const filterStore = usePropertyFilterStore();

  // ดึงค่า type จาก URL parameters (sale หรือ rent)
  const typeParam = searchParamsObj.get('type');

  // แปลงค่า type จาก URL เป็น listingType ที่ใช้ใน filter
  const getListingTypeFromParam = () => {
    if (typeParam === 'rent') return 'RENT';
    if (typeParam === 'sale') return 'SALE';
    return 'SALE'; // ค่าเริ่มต้น
  };

  // filters state (single source of truth)
  const [filters, setFilters] = useState({
    propertyType: filterStore.propertyType || '',
    minPrice: filterStore.minPrice || 0,
    maxPrice: filterStore.maxPrice || 15000000,
    zoneId: filterStore.zoneId || '',
    listingType: getListingTypeFromParam(), // ใช้ function ที่สร้างขึ้นแทนค่าคงที่
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

  // Sync currentPage with searchParams
  useEffect(() => {
    const pageFromParams = parseInt(searchParams.page) || 1;
    setCurrentPage(pageFromParams);
  }, [searchParams.page]);

  useEffect(() => {
    setPropertyItems(properties)
    setPaginationItems(pagination)
  }, [properties, pagination, setPropertyItems, setPaginationItems])


  useEffect(() => {
    console.log("Listproperty112312", propertyItems)
  }, [propertyItems])



  const handleSearch = (filterValues) => {
    console.log('ListingPropertiesPage handleSearch called with:', filterValues);
    
    setFilters((prev) => ({
      ...prev,
      ...filterValues
    }));

    // อัปเดต URL เพื่อให้สะท้อนสถานะการกรองปัจจุบัน
    const params = new URLSearchParams(searchParamsObj.toString());

    // ถ้ามีการเปลี่ยนแปลง listingType ให้อัปเดต type parameter ใน URL
    if (filterValues.listingType) {
      const typeValue = filterValues.listingType === 'SALE' ? 'sale' : 'rent';
      params.set('type', typeValue);
    }

    // อัปเดต parameters อื่นๆ ถ้าจำเป็น
    if (filterValues.propertyType) params.set('propertyType', filterValues.propertyType);
    if (filterValues.zoneId) params.set('zoneId', filterValues.zoneId);
    if (filterValues.bedrooms) params.set('bedrooms', filterValues.bedrooms);
    if (filterValues.bathrooms) params.set('bathrooms', filterValues.bathrooms);
    
    // เพิ่ม searchQuery parameter
    if (filterValues.searchQuery) {
      params.set('searchQuery', filterValues.searchQuery);
    }

    console.log('URL params being set:', params.toString());

    // Reset หน้าเมื่อมีการเปลี่ยนแปลง filter
    params.set('page', '1');

    // นำทางไปยัง URL ใหม่
    router.push(`${pathname}?${params.toString()}`);
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
      <section className="property-banner-style2 bdrs24 maxw1600 mx-auto mt60 p-0">
        <div className="inner-style1">
          <div className="container">
            <div className="row">
              <div className="col-xl-11 mx-auto">

                <HeroSearchBar onSearch={handleSearch} zones={zones}
                />

              
              </div>
              
            </div>

          </div>
          {/* End .container */}
        </div>
      </section>

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
                      propertyItems && propertyItems?.length > 0 ? (
                        propertyItems.map((property) => (
                          <div className="col-sm-6 col-md-6 col-lg-4 mb-4" key={property.id}>
                            <PropertyFilteringSuspense property={property} />
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center">{dynamicT('no-data-found', 'No data found')}</div>
                      )
                    )}
                  </div>
                </div>

                <div className="col-12 text-center mt-4 mb-5">
                  <div className="results-count">
                    <p>
                      {dynamicT('results-showing', '{start}-{end} of {total}')
                        .replace('{start}', '1')
                        .replace('{end}', propertyItems?.length || '0')
                        .replace('{total}', paginationItems?.total || '0')
                      } {dynamicT('property-available', 'property available')}
                    </p>
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

                    {/* Smart pagination with ellipsis */}
                    {(() => {
                      const currentPage = parseInt(paginationItems?.page || 1);
                      const totalPages = Math.max(1, paginationItems?.pages || 1);
                      const pages = [];
                      
                      if (totalPages <= 7) {
                        // แสดงทุกหน้าถ้าไม่เกิน 7 หน้า
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`page-number ${currentPage === i ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i);
                              }}
                            >
                              {i}
                            </button>
                          );
                        }
                      } else {
                        // Smart pagination สำหรับหน้าเยอะ
                        // หน้าแรก
                        pages.push(
                          <button
                            key={1}
                            className={`page-number ${currentPage === 1 ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(1);
                            }}
                          >
                            1
                          </button>
                        );
                        
                        // Ellipsis ซ้าย
                        if (currentPage > 4) {
                          pages.push(
                            <span key="ellipsis-left" className="page-ellipsis">...</span>
                          );
                        }
                        
                        // หน้าปัจจุบันและข้างเคียง
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== totalPages) {
                            pages.push(
                              <button
                                key={i}
                                className={`page-number ${currentPage === i ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(i);
                                }}
                              >
                                {i}
                              </button>
                            );
                          }
                        }
                        
                        // Ellipsis ขวา
                        if (currentPage < totalPages - 3) {
                          pages.push(
                            <span key="ellipsis-right" className="page-ellipsis">...</span>
                          );
                        }
                        
                        // หน้าสุดท้าย
                        if (totalPages > 1) {
                          pages.push(
                            <button
                              key={totalPages}
                              className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(totalPages);
                              }}
                            >
                              {totalPages}
                            </button>
                          );
                        }
                      }
                      
                      return pages;
                    })()}

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
