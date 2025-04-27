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

// Import custom styles
import '@/styles/property-listing.scss';

// Property Cards Skeleton component for loading state
const PropertyCardsSkeleton = ({ count = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
          <div className="property-card-skeleton">
            <div className="image-skeleton"></div>
            <div className="content-skeleton">
              <div className="title-skeleton"></div>
              <div className="address-skeleton"></div>
              <div className="features-skeleton">
                <div className="feature-item-skeleton"></div>
                <div className="feature-item-skeleton"></div>
                <div className="feature-item-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const ListingPropertiesPage = ({ properties = [], pagination = {}, zones = [], searchParams = {} }) => {
  const t = useTranslations('PropertyList');
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page) || 1);
  const [selectedZone, setSelectedZone] = useState(searchParams.zoneId || '');
  const [selectedPropertyType, setSelectedPropertyType] = useState(searchParams.propertyType || '');
  const [selectedListingType, setSelectedListingType] = useState(searchParams.listingType || '');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  const [sortOrder, setSortOrder] = useState(searchParams.sort || 'newest');
  const [isLoading, setIsLoading] = useState(false);

  // นำข้อมูล zones ไปเก็บใน Zustand store
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

    // เมื่อ component mount หรือมีการเปลี่ยนแปลง zones
    if (zones && zones.length > 0) {
      setZones(zones);
    }
    // หยุด loading เมื่อได้รับข้อมูล properties
    setIsLoading(false);
  }, [zones, setZones, properties]);

  // เมื่อมีการเปลี่ยนหน้า
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
    
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // รีเซ็ตหน้าเป็น 1 เมื่อเปลี่ยนการกรอง
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
      {/* Main Header Nav */}
      <Header />

      {/* Mobile Menu */}
      <MobileMenu />

     
      {/* Main Content Section */}
      <div className="main-content ">
        {/* Hero Banner Section with Search Form - Exactly like in the image */}
        <div className="banner-wrapper">
          <div className="container">
            <div className="hero-banner">
              <div className="banner-content">
                <h1 className="text-white">Find Your Dream Home</h1>
                <p className="text-white">We've more than 1,000+ properties listed on our website</p>
              </div>
              
              {/* Search Form - New design with tabs and input */}
              <div className="search-form-wrapper">
                <div className="search-tabs">
                  <button
                    className={`tab-btn ${selectedListingType === 'SALE' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedListingType('SALE');
                      handleFilterChange2();
                    }}
                  >
                    Buy
                  </button>
                  <button
                    className={`tab-btn ${selectedListingType === 'RENT' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedListingType('RENT');
                      handleFilterChange2();
                    }}
                  >
                    Rent
                  </button>
                </div>
                
                <div className="search-input-container">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Condominium" 
                    readOnly
                  />
                  
                  <div className="search-actions">
                    <button className="advanced-btn">
                      <i className="fas fa-sliders-h"></i>
                      <span>Advanced</span>
                    </button>
                    
                    <button className="search-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Section */}
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
                    {/* Property Cards with Loading State */}
                    {isLoading ? (
                      <PropertyCardsSkeleton count={6} />
                    ) : (
                      properties && properties.length > 0 ? (
                        properties.map((property) => (
                          <div className="col-sm-6 col-md-6 col-lg-4 mb-4" key={property.id}>
                            <PropertyFiltering property={property} />
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h3>{t('noPropertiesFound')}</h3>
                          <p>{t('tryDifferentFilters')}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                
                {/* Pagination at bottom - exactly like in the image */}
                <div className="col-12 text-center mt-4 mb-5">
                  <div className="results-count">
                    <p>1-{properties.length} of {pagination?.total || 0} property available</p>
                  </div>
                  
                  {/* แสดง pagination เฉพาะเมื่อมีมากกว่า 1 หน้า หรือแสดงตลอดเพื่อให้เหมือนในรูป */}
                  <div className="simple-pagination">
                    <button 
                      className="page-nav prev" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(parseInt(pagination?.page || 1) - 1);
                      }} 
                      disabled={parseInt(pagination?.page || 1) <= 1 || pagination?.pages <= 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    {/* แสดงปุ่มหมายเลขหน้าตามจำนวนหน้าที่มีจริง */}
                    {[...Array(Math.max(1, pagination?.pages || 1))].map((_, i) => (
                      <button 
                        key={i}
                        className={`page-number ${parseInt(pagination?.page || 1) === i + 1 ? 'active' : ''}`}
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
                        handlePageChange(parseInt(pagination?.page || 1) + 1);
                      }} 
                      disabled={parseInt(pagination?.page || 1) >= pagination?.pages || pagination?.pages <= 1}
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
      

      {/* Footer */}
      <Footer />

      {/* Scroll To Top */}
      <ScrollToTop />
    </>
  );
};

export default ListingPropertiesPage;
