'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const PropertyLocation = ({ property }) => {
   const mapContainerStyle = {
      width: '100%',
      height: '400px',
      borderRadius: '20px'
   }

   const center = {
      lat: property?.latitude || 12.9236,
      lng: property?.longitude || 100.8825
   }

   const mapOptions = {
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
   }

   return (
      <div className="property-location mb-50">
         <div className="bg-white shadow4 border-20 p-40">
            <h4 className="mb-20">Location</h4>
            <p className="fs-20 lh-lg mb-40">
               {property?.address || 'Address not specified'}
            </p>
            
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
               <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                  options={mapOptions}
               >
                  <Marker position={center} />
               </GoogleMap>
            </LoadScript>
         </div>
      </div>
   )
}

export default PropertyLocation
