import * as yup from 'yup';

// Validation schema for the property form
export const propertyFormSchema = yup.object().shape({
  // Property Information
  propertyTitle: yup.string().required('Property title is required'),
  projectName: yup.string().required('Project name is required'),
  
  // Property Type
  propertyType: yup.array().min(1, 'At least one property type must be selected'),
  
  // Status
  status: yup.string(),
  
  // Location
  address: yup.string().required('Address is required'),
  district: yup.string().required('District is required'),
  subdistrict: yup.string().required('Subdistrict is required'),
  province: yup.string().required('Province is required'),
  postalCode: yup.string().required('Postal code is required'),
  

  // Property Details
  bedrooms: yup.string().required('Number of bedrooms is required'),
  bathrooms: yup.string().required('Number of bathrooms is required'),
  area: yup.string().required('Area is required'),
  
  // Property Detail fields
  propertyId: yup.string(),
  ownershipQuota: yup.string(),
  land_size_rai: yup.string(),
  land_size_ngan: yup.string(),
  land_size_sq_wah: yup.string(),
  usableArea: yup.string().required('Usable area is required'),
  floors: yup.string(),
  furnishing: yup.string().required('Furnishing is required'),
  constructionYear: yup.string(),
  communityFees: yup.string(),
  
  // Pricing
  price: yup.string(),
  priceUnit: yup.string(),
  promotionalPrice: yup.string(),
  rentalPrice: yup.string(),
  shortTerm3Months: yup.string(),
  shortTerm6Months: yup.string(),
  shortTerm1Year: yup.string(),
  
  // Description
  description: yup.string().required('Description is required'),
  paymentPlan: yup.string(),
  
  // Translations
  translatedTitles: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  translatedDescriptions: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  translatedPaymentPlans: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  
  // Social Media
  socialMedia: yup.object({
    youtubeUrl: yup.string(),
    tiktokUrl: yup.string()
  }),
  
  // Features/Amenities
  features: yup.object(),
  highlights: yup.object(),
  nearby: yup.object(),
  views: yup.object(),
  facilities: yup.object(),
  
  // Contact Information
  contactInfo: yup.object({
    phone: yup.string(),
    email: yup.string(),
    secondaryPhone: yup.string(),
    lineId: yup.string(),
    wechatId: yup.string(),
    whatsapp: yup.string(),
    facebookMessenger: yup.string(),
    instagram: yup.string()
  }),
  
  // Co-Agent Accept
  coAgentAccept: yup.boolean(),
  commissionType: yup.string().when('coAgentAccept', {
    is: true,
    then: (schema) => schema.oneOf(['percent', 'amount'], 'Commission type must be either percent or amount'),
    otherwise: (schema) => schema
  }),
  commissionPercent: yup.string().when(['coAgentAccept', 'commissionType'], {
    is: (coAgentAccept, commissionType) => coAgentAccept && commissionType === 'percent',
    then: (schema) => schema.required('Commission percentage is required'),
    otherwise: (schema) => schema
  }),
  commissionAmount: yup.string().when(['coAgentAccept', 'commissionType'], {
    is: (coAgentAccept, commissionType) => coAgentAccept && commissionType === 'amount',
    then: (schema) => schema.required('Commission amount is required'),
    otherwise: (schema) => schema
  }),
  privateNote: yup.string(),
  
  // Featured property
  isFeatured: yup.boolean(),
  
  // Terms agreement
  termsAgree: yup.boolean().oneOf([true], 'You must agree to the terms')
});

// Simplified schema for initial form setup
export const propertyFormSchemaBasic = yup.object().shape({
  // Property Information
  propertyTitle: yup.string().required('Property title is required'),
  projectName: yup.string().required('Project name is required'),
  
  // Property Type
  propertyTypes: yup.array().min(1, 'At least one property type must be selected'),
  
  // Status
  status: yup.string(),
  
  // Location
  address: yup.string().required('Address is required'),
  district: yup.string().required('District is required'),
  subdistrict: yup.string().required('Subdistrict is required'),
  province: yup.string().required('Province is required'),
  postalCode: yup.string().required('Postal code is required'),
  
  // Property Details
  bedrooms: yup.string().required('Number of bedrooms is required'),
  bathrooms: yup.string().required('Number of bathrooms is required'),
  area: yup.string().required('Area is required'),
  
  // Property Detail fields
  propertyId: yup.string(),
  ownershipQuota: yup.string().required('Ownership quota is required'),
  land_size_rai: yup.string(),
  land_size_ngan: yup.string(),
  land_size_sq_wah: yup.string(), 
  usableArea: yup.string().required('Usable area is required'),
  floors: yup.string(), 
  furnishing: yup.string().required('Furnishing is required'),
  constructionYear: yup.string(), 
  communityFees: yup.string(), 
  
  // Pricing
  price: yup.string(),
  priceUnit: yup.string(),
  promotionalPrice: yup.string(),
  rentalPrice: yup.string(),
  shortTerm3Months: yup.string(),
  shortTerm6Months: yup.string(),
  shortTerm1Year: yup.string(),
  
  // Description
  description: yup.string().required('Description is required'),
  paymentPlan: yup.string(),
  
  // Translations
  translatedTitles: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  translatedDescriptions: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  translatedPaymentPlans: yup.object({
    th: yup.string(),
    zh: yup.string(),
    ru: yup.string()
  }),
  
  // Social Media
  socialMedia: yup.object({
    youtubeUrl: yup.string(),
    tiktokUrl: yup.string()
  }),
  
  // Features/Amenities
  features: yup.object(),
  highlights: yup.object(),
  nearby: yup.object(),
  views: yup.object(),
  facilities: yup.object(),
  
  // Contact Information
  contactInfo: yup.object({
    phone: yup.string(),
    email: yup.string(),
    secondaryPhone: yup.string(),
    lineId: yup.string(),
    wechatId: yup.string(),
    whatsapp: yup.string(),
    facebookMessenger: yup.string(),
    instagram: yup.string()
  }),
  
  // Co-Agent Accept
  coAgentAccept: yup.boolean(),
  commissionType: yup.string().when('coAgentAccept', {
    is: true,
    then: (schema) => schema.oneOf(['percent', 'amount'], 'Commission type must be either percent or amount'),
    otherwise: (schema) => schema
  }),
  commissionPercent: yup.string().when(['coAgentAccept', 'commissionType'], {
    is: (coAgentAccept, commissionType) => coAgentAccept && commissionType === 'percent',
    then: (schema) => schema.required('Commission percentage is required'),
    otherwise: (schema) => schema
  }),
  commissionAmount: yup.string().when(['coAgentAccept', 'commissionType'], {
    is: (coAgentAccept, commissionType) => coAgentAccept && commissionType === 'amount',
    then: (schema) => schema.required('Commission amount is required'),
    otherwise: (schema) => schema
  }),
  privateNote: yup.string(),
  
  // Featured property
  isFeatured: yup.boolean(),
  
  // Terms agreement
  termsAgree: yup.boolean().oneOf([true], 'You must agree to the terms')
});
