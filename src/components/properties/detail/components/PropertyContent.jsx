'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import PropertyMap from './PropertyMap';
import ShortTermRental from './ShortTermRental';
import { getLocalizedIconName, getIconAltText } from '@/utils/iconUtils';

const PropertyContent = ({ property, description, getPropertyTypeText, getFurnishingText }) => {
  const t = useTranslations('PropertyDetail');
  const locale = useLocale();
  const { t: dynamicT } = useSimpleTranslations('listing');

  const formatLandSize = () => {
    const { landSizeRai, landSizeNgan, landSizeSqWah, landSizeSqm } = property;
    const parts = [];
    if (landSizeRai > 0) parts.push(`${landSizeRai} Rai`);
    if (landSizeNgan > 0) parts.push(`${landSizeNgan} Ngan`);
    if (landSizeSqWah > 0) parts.push(`${landSizeSqWah} Sq.Wah`);
    if (landSizeSqm > 0) parts.push(`${landSizeSqm} Sqm.`);

    return parts.length > 0 ? parts.join(' ') : 'N/A';
  };


  const getCommunityFeeUnit = (propertyTypeName) => {
    if (!propertyTypeName) return '';
    const type = propertyTypeName.trim().toLowerCase();

    const sqmTypes = ['condo', 'apartment', 'commercial', 'office', 'retail'];
    const sqwahTypes = ['house', 'villa', 'townhouse', 'land'];

    if (sqmTypes.includes(type)) {
      return '/sqm.';
    }

    if (sqwahTypes.includes(type)) {
      return '/sqwah.';
    }

    return ''; // Default case, no unit
  };

  useEffect(() => {
    console.log("propertyContent", property);
  }, [property]);

  return (
    <div className="property-content">
      {property.listings.filter(listing => listing.listingType === 'RENT').length > 0 && (
        <ShortTermRental property={property} />
      )}

      {/* Highlights Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">{dynamicT('highlights', 'Highlights')}</h3>
        <div className="property-highlights">
          <ul className="row g-3">
            {property?.highlights?.length > 0 ? (
              property.highlights.map((item, index) => (
                <div className="col-6 col-md-4" key={`highlight-${index}`}>
                  <div className="nearby-item" style={{
                    backgroundColor: 'rgb(232, 245, 233)',
                    borderColor: 'rgb(165, 214, 167)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <h6 style={{ margin: 0 }}>{getLocalizedIconName(item.Icon, locale)}</h6>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No highlights available for this property.</p>
              </div>
            )}
          </ul>
        </div>
      </div>



      {/* Description Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">{dynamicT('basic-detail', 'Description')}</h3>
        <div className="property-description">
          <p>{description || 'No description available for this property.'}</p>
        </div>
      </div>

      <hr></hr>

      {/* Details Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">{dynamicT('details', 'Details')}</h3>
        <div className="property-details-table border-0">
          <table className="table" style={{
            borderStyle: 'none'
          }}>
            <tbody style={{ borderStyle: 'hidden !important' }}>
              <tr style={{ borderStyle: 'hidden !important' }}>
                <th>{dynamicT('property-code', 'Property Code')}</th>
                <td>{property.propertyCode || 'N/A'}</td>
                <th>{dynamicT('ownership-quota', 'Ownership Quota')}</th>
                <td>{property.ownershipQuota || 'N/A'}</td>
              </tr>
              <tr style={{ borderStyle: 'hidden !important' }}>
                <th>{dynamicT('land-size', 'Land Size')}</th>
                <td>{formatLandSize()}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>{dynamicT('usable-area', 'Useable Area')}</th>
                <td>{property.usableArea ? `${property.usableArea} sq.m.` : 'N/A'}</td>
                <th>{dynamicT('floor', 'Floor')}</th>
                <td>{property.floors ? `${property.floors} Floors` : 'N/A'}</td>
              </tr>
              <tr>
                <th>{dynamicT('furnishing', 'Furnishing')}</th>
                <td>{getFurnishingText(property.furnishing) || 'N/A'}</td>
                <th>{dynamicT('bedrooms', 'Bedrooms')}</th>
                <td>{property.bedrooms || 'N/A'}</td>
              </tr>
              <tr>
                <th>{dynamicT('bathrooms', 'Bathrooms')}</th>
                <td>{property.bathrooms || 'N/A'}</td>
                <th>{dynamicT('construction-year', 'Construction Year')}</th>
                <td>{property.constructionYear || 'N/A'}</td>
              </tr>
              {property.communityFee > 0 && (
                <tr>
                  <th>{dynamicT('community-fees', 'Community Fees')}</th>
                  <td>
                    {`${property.communityFee} ${getCommunityFeeUnit(property.propertyType?.nameEn)}`}
                  </td>
                  <th></th>
                  <td></td>
                </tr>
              )}
              <tr>
                <th>{dynamicT('area', 'Area')}</th>
                <td>{property.district || 'N/A'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>{dynamicT('address', 'Address')}</th>
                <td colSpan="3">{property.address || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Location Map */}
      <div className="property-section mb-5">
        <div className="property-map">
          <PropertyMap property={property} />
        </div>
      </div>

      <hr></hr>

      <div className="property-section mb-5">
        <h3 className="section-title mb-4">{dynamicT('near-by', 'Near By')}</h3>
        <div className="nearby-items">
          <div className="row g-3">

            {property.nearbyPlaces.map((item, index) => (
              <div className="col-6 col-md-4" key={`nearby-${index}`}>
                <div className="nearby-item">
                  {item?.Icon?.iconPath && (
                    <>
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={getIconAltText(item?.Icon, locale)} className="img-fluid" width={25} height={25} />

                      <span className={"span-items"} style={{ marginLeft: '10px' }}>{getLocalizedIconName(item?.Icon, locale)}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr></hr>

      {/* View Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">{dynamicT('view', 'View')}</h3>
        <div className="view-items">
          <div className="row g-3">
            {property?.views?.length > 0 ? (
              property.views.map((item, index) => (
                <div className="col-6 col-md-4" key={`view-${index}`}>
                  <div className="view-item">

                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={getIconAltText(item?.Icon, locale)} className="img-fluid" width={25} height={25} />
                    <span className={"span-items"} style={{ marginLeft: '10px' }}>{getLocalizedIconName(item?.Icon, locale)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>{dynamicT('no-views-specified', 'No views specified for this property.')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr></hr>

      {/* Facilities Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">{dynamicT('facilities', 'Facilities')}</h3>
        <div className="facility-items">
          <div className="row g-3">
            {property.facilities && property.facilities.length > 0 ? (
              property.facilities.map((item, index) => (
                <div className="col-6 col-md-4" key={`facility-${index}`}>
                  <div className="facility-item">
                    {item?.Icon?.iconPath && (
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={getIconAltText(item?.Icon, locale)} className="img-fluid" width={25} height={25} />
                    )}
                    <span className={"span-items"} style={{ marginLeft: '10px' }}>{getLocalizedIconName(item?.Icon, locale)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>{dynamicT('no-facilities-available', 'No facilities available for this property.')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr></hr>

      {/* Amenity Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">{dynamicT('amenity', 'Amenity')}</h3>
        <div className="amenity-items">
          <div className="row g-3">
            {property.amenities && property.amenities.length > 0 ? (
              property.amenities.map((item, index) => (
                <div className="col-6 col-md-4" key={`amenity-${index}`}>
                  <div className="amenity-item">
                    {item?.Icon?.iconPath && (
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={getIconAltText(item?.Icon, locale)} className="img-fluid" width={25} height={25} />
                    )}
                    <span className="span-items" style={{ marginLeft: '10px' }}>{getLocalizedIconName(item?.Icon, locale)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>{dynamicT('no-amenities-available', 'No amenities available for this property.')}</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Map Section */}

    </div>
  );
};

export default PropertyContent;
