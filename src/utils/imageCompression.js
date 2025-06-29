/**
 * Image compression utility functions
 */

/**
 * Compress image file while maintaining quality
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,      // Maximum width
    maxHeight = 1080,     // Maximum height
    quality = 0.8,        // JPEG quality (0.1 - 1.0)
    format = 'jpeg',      // Output format: 'jpeg' or 'webp'
    maxSizeKB = 500       // Maximum file size in KB
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );
        
        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to blob conversion failed'));
              return;
            }
            
            // Check if file size is acceptable
            const fileSizeKB = blob.size / 1024;
            
            if (fileSizeKB > maxSizeKB && quality > 0.1) {
              // If still too large, compress further
              const newQuality = Math.max(0.1, quality - 0.1);
              compressImage(file, { ...options, quality: newQuality })
                .then(resolve)
                .catch(reject);
              return;
            }
            
            // Create new file with compressed data
            const compressedFile = new File(
              [blob], 
              file.name, 
              { 
                type: `image/${format}`,
                lastModified: Date.now()
              }
            );
            
            resolve(compressedFile);
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 * @param {number} originalWidth 
 * @param {number} originalHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns {Object} - New width and height
 */
const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;
  
  // If image is larger than max dimensions, scale it down
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    
    if (width > height) {
      width = maxWidth;
      height = width / aspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    } else {
      height = maxHeight;
      width = height * aspectRatio;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
    }
  }
  
  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed files
 */
export const compressMultipleImages = async (files, options = {}) => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

/**
 * Get image file info
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Image information
 */
export const getImageInfo = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        sizeKB: Math.round(file.size / 1024),
        sizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
        type: file.type,
        name: file.name
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image info'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Check if file is an image
 * @param {File} file 
 * @returns {boolean}
 */
export const isImageFile = (file) => {
  return file && file.type.startsWith('image/');
};

/**
 * Format file size for display
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};