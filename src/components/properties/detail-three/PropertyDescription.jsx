'use client'

const PropertyDescription = ({ property, locale }) => {
   // Get localized description
   const getDescription = () => {
      try {
         const descriptions = JSON.parse(property?.translatedDescriptions || '{}')
         return descriptions[locale] || descriptions['en'] || property?.description || ''
      } catch {
         return property?.description || ''
      }
   }

   // Get payment plan
   const getPaymentPlan = () => {
      try {
         const plans = JSON.parse(property?.translatedPaymentPlans || '{}')
         return plans[locale] || plans['en'] || property?.paymentPlan || ''
      } catch {
         return property?.paymentPlan || ''
      }
   }

   const description = getDescription()
   const paymentPlan = getPaymentPlan()

   return (
      <>
         {/* Description */}
         <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
            <h4 className="mb-20">{locale === 'th' ? 'รายละเอียด' : 'Description'}</h4>
            <div 
               className="fs-20 lh-lg" 
               dangerouslySetInnerHTML={{ __html: description }}
            />
         </div>

         {/* Payment Plan */}
         {paymentPlan && (
            <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
               <h4 className="mb-20">{locale === 'th' ? 'แผนการชำระเงิน' : 'Payment Plan'}</h4>
               <div 
                  className="fs-20 lh-lg" 
                  dangerouslySetInnerHTML={{ __html: paymentPlan }}
               />
            </div>
         )}
      </>
   )
}

export default PropertyDescription
