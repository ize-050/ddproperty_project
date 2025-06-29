/**
 * Image validation utilities
 */

export const IMAGE_LIMITS = {
  MAX_IMAGES_PER_SECTION: 100, // Increased from 50 to 100
  MAX_TOTAL_SIZE_MB: 1000, // Increased from 500MB to 1GB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MIN_DIMENSIONS: {
    width: 800,
    height: 600
  }
};

/**
 * Validate image count limit
 * @param {number} currentCount - Current number of images
 * @param {number} newCount - Number of images being added
 * @param {number} maxLimit - Maximum allowed images
 * @returns {Object} - Validation result
 */
export const validateImageCount = (currentCount, newCount, maxLimit = IMAGE_LIMITS.MAX_IMAGES_PER_SECTION) => {
  const totalCount = currentCount + newCount;
  
  if (totalCount > maxLimit) {
    return {
      isValid: false,
      error: `Maximum ${maxLimit} images allowed. You're trying to add ${newCount} images but already have ${currentCount}. Please remove some images first.`,
      remainingSlots: maxLimit - currentCount
    };
  }
  
  return {
    isValid: true,
    error: null,
    remainingSlots: maxLimit - totalCount
  };
};

/**
 * Validate file format
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export const validateFileFormat = (file) => {
  if (!IMAGE_LIMITS.SUPPORTED_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format. Only ${IMAGE_LIMITS.SUPPORTED_FORMATS.join(', ')} are allowed.`,
      fileName: file.name
    };
  }
  
  return {
    isValid: true,
    error: null,
    fileName: file.name
  };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Object} - Validation result
 */
export const validateFileSize = (file, maxSizeMB = 50) => {
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > maxSizeMB) {
    return {
      isValid: false,
      error: `File size too large. Maximum ${maxSizeMB}MB allowed, but file is ${fileSizeMB.toFixed(2)}MB.`,
      fileName: file.name,
      actualSize: fileSizeMB
    };
  }
  
  return {
    isValid: true,
    error: null,
    fileName: file.name,
    actualSize: fileSizeMB
  };
};

/**
 * Validate total collection size
 * @param {Array} files - Array of files to validate
 * @param {number} maxTotalSizeMB - Maximum total size in MB
 * @returns {Object} - Validation result
 */
export const validateTotalSize = (files, maxTotalSizeMB = IMAGE_LIMITS.MAX_TOTAL_SIZE_MB) => {
  const totalSizeMB = files.reduce((total, file) => {
    return total + (file.size / (1024 * 1024));
  }, 0);
  
  if (totalSizeMB > maxTotalSizeMB) {
    return {
      isValid: false,
      error: `Total file size too large. Maximum ${maxTotalSizeMB}MB allowed, but total is ${totalSizeMB.toFixed(2)}MB.`,
      totalSize: totalSizeMB
    };
  }
  
  return {
    isValid: true,
    error: null,
    totalSize: totalSizeMB
  };
};

/**
 * Validate image dimensions
 * @param {File} file - Image file to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      const { width: minWidth, height: minHeight } = IMAGE_LIMITS.MIN_DIMENSIONS;
      
      if (width < minWidth || height < minHeight) {
        resolve({
          isValid: false,
          error: `Image dimensions too small. Minimum ${minWidth}x${minHeight} required, but image is ${width}x${height}.`,
          fileName: file.name,
          dimensions: { width, height }
        });
      } else {
        resolve({
          isValid: true,
          error: null,
          fileName: file.name,
          dimensions: { width, height }
        });
      }
    };
    
    img.onerror = () => {
      resolve({
        isValid: false,
        error: 'Unable to read image dimensions. File may be corrupted.',
        fileName: file.name
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Comprehensive file validation
 * @param {FileList|Array} files - Files to validate
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} - Comprehensive validation result
 */
export const validateFiles = async (files, options = {}) => {
  const {
    currentCount = 0,
    maxImages = IMAGE_LIMITS.MAX_IMAGES_PER_SECTION,
    maxFileSize = 50,
    maxTotalSize = IMAGE_LIMITS.MAX_TOTAL_SIZE_MB,
    checkDimensions = false
  } = options;
  
  const fileArray = Array.from(files);
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    validFiles: [],
    invalidFiles: []
  };
  
  // Check count limit
  const countValidation = validateImageCount(currentCount, fileArray.length, maxImages);
  if (!countValidation.isValid) {
    results.isValid = false;
    results.errors.push(countValidation.error);
    return results;
  }
  
  // Check total size
  const totalSizeValidation = validateTotalSize(fileArray, maxTotalSize);
  if (!totalSizeValidation.isValid) {
    results.isValid = false;
    results.errors.push(totalSizeValidation.error);
  }
  
  // Validate each file
  for (const file of fileArray) {
    const fileValidation = {
      file,
      isValid: true,
      errors: []
    };
    
    // Check format
    const formatValidation = validateFileFormat(file);
    if (!formatValidation.isValid) {
      fileValidation.isValid = false;
      fileValidation.errors.push(formatValidation.error);
    }
    
    // Check size
    const sizeValidation = validateFileSize(file, maxFileSize);
    if (!sizeValidation.isValid) {
      fileValidation.isValid = false;
      fileValidation.errors.push(sizeValidation.error);
    }
    
    // Check dimensions if requested
    if (checkDimensions && fileValidation.isValid) {
      try {
        const dimensionValidation = await validateImageDimensions(file);
        if (!dimensionValidation.isValid) {
          fileValidation.isValid = false;
          fileValidation.errors.push(dimensionValidation.error);
        }
      } catch (error) {
        fileValidation.isValid = false;
        fileValidation.errors.push('Failed to validate image dimensions');
      }
    }
    
    // Add to appropriate array
    if (fileValidation.isValid) {
      results.validFiles.push(file);
    } else {
      results.isValid = false;
      results.invalidFiles.push(fileValidation);
      results.errors.push(...fileValidation.errors);
    }
  }
  
  return results;
};

/**
 * Get user-friendly error messages
 * @param {Array} errors - Array of error messages
 * @returns {String} - Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0];
  }
  
  return `Multiple validation errors:\n${errors.map((error, index) => `${index + 1}. ${error}`).join('\n')}`;
};