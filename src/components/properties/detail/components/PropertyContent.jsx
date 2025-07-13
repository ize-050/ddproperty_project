'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PropertyMap from './PropertyMap';
import ShortTermRental from './ShortTermRental';

const PropertyContent = ({ property, description, getPropertyTypeText, getFurnishingText }) => {
  const t = useTranslations('PropertyDetail');

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
        <h3 className="section-title mb-3">Highlights</h3>
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
                    <h6 style={{ margin: 0 }}>{item.Icon.name}</h6>
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
        <h3 className="section-title mb-3">Description</h3>
        <div className="property-description">
          <p>{description || 'No description available for this property.'}</p>
        </div>
      </div>

      <hr></hr>

      {/* Details Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">Details</h3>
        <div className="property-details-table border-0">
          <table className="table" style={{
            borderStyle: 'none'
          }}>
            <tbody style={{ borderStyle: 'hidden !important' }}>
              <tr style={{ borderStyle: 'hidden !important' }}>
                <th>Property ID</th>
                <td>{property.id || 'DP000010'}</td>
                <th>Ownership Quota</th>
                <td>{property.ownershipQuota || 'Thai'}</td>
              </tr>
              <tr style={{ borderStyle: 'hidden !important' }}>
                <th>Land Size</th>
                <td>{property.landSize || '117.8 sq.wah'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>Useable Area</th>
                <td>{property.area || '400'} sq.m.</td>
                <th>Floor</th>
                <td>{property.floors || '2'} Floors</td>
              </tr>
              <tr>
                <th>Furnishing</th>
                <td>{getFurnishingText(property.furnishing) || 'Fully Fitted'}</td>
                <th>Bedrooms</th>
                <td>{property.bedrooms || '4'}</td>
              </tr>
              <tr>
                <th>Bathrooms</th>
                <td>{property.bathrooms || '4'}</td>
                <th>Construction Year</th>
                <td>{property.constructionYear || 'N/A'}</td>
              </tr>
              {property.communityFee > 0 && (
                <tr>
                  <th>Community Fees</th>
                  <td>
                    {`${property.communityFee} ${getCommunityFeeUnit(property.propertyType?.nameEn)}`}
                  </td>
                  <th></th>
                  <td></td>
                </tr>
              )}
              <tr>
                <th>Area</th>
                <td>{property.district || 'Banglamung'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>Address</th>
                <td colSpan="3">{property.address || 'Sukhumvit rd. Banglamung, Thailand'}</td>
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
        <h3 className="section-title mb-4">Near By</h3>
        <div className="nearby-items">
          <div className="row g-3">

            {property.nearbyPlaces.map((item, index) => (
              <div className="col-6 col-md-4" key={`nearby-${index}`}>
                <div className="nearby-item">
                  {item?.Icon?.iconPath && (
                    <>
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={item.name} className="img-fluid" width={25} height={25} />

                      <span className={"span-items"} style={{ marginLefปt: '10px' }}>{item?.Icon?.name}</span>
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
        <h3 className="section-title mb-4">View</h3>
        <div className="view-items">
          <div className="row g-3">
            {property?.views?.length > 0 ? (
              property.views.map((item, index) => (
                <div className="col-6 col-md-4" key={`view-${index}`}>
                  <div className="view-item">

                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={item.name} className="img-fluid" width={25} height={25} />
                    <span className={"span-items"} style={{ marginLeft: '10px' }}>{item?.Icon?.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No views specified for this property.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr></hr>

      {/* Facilities Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">Facilities</h3>
        <div className="facility-items">
          <div className="row g-3">
            {property.facilities && property.facilities.length > 0 ? (
              property.facilities.map((item, index) => (
                <div className="col-6 col-md-4" key={`facility-${index}`}>
                  <div className="facility-item">
                    {item?.Icon?.iconPath && (
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={item.name} className="img-fluid" width={25} height={25} />
                    )}
                    <span className={"span-items"} style={{ marginLeft: '10px' }}>{item?.Icon?.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No facilities available for this property.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr></hr>

      {/* Amenity Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">Amenity</h3>
        <div className="amenity-items">
          <div className="row g-3">
            {property.amenities && property.amenities.length > 0 ? (
              property.amenities.map((item, index) => (
                <div className="col-6 col-md-4" key={`amenity-${index}`}>
                  <div className="amenity-item">
                    {item?.Icon?.iconPath && (
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.Icon?.iconPath}`} alt={item.name} className="img-fluid" width={25} height={25} />
                    )}
                    <span className="span-items" style={{ marginLeft: '10px' }}>{item?.Icon?.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No amenities available for this property.</p>
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
