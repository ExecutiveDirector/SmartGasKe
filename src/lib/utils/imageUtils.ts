// ============================================================
// FILE: src/lib/utils/imageUtils.ts
// Image Utility Functions for Product Images
// ============================================================

/**
 * Extracts the first image from product_images field
 * Handles both string (JSON) and array formats
 */
export function extractFirstImage(productImages: string | string[] | null | undefined): string {
  if (!productImages) {
    return '/images/placeholder-product.jpg';
  }

  try {
    // If it's already a string URL, return it
    if (typeof productImages === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(productImages);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
          return parsed[0];
        }
      } catch {
        // If parsing fails, check if it's a direct URL
        if (productImages.startsWith('http') || productImages.startsWith('/')) {
          return productImages;
        }
      }
    }

    // If it's an array, return the first item
    if (Array.isArray(productImages) && productImages.length > 0 && productImages[0]) {
      return productImages[0];
    }
  } catch (error) {
    console.warn('Failed to extract image:', error);
  }

  return '/images/placeholder-product.jpg';
}

/**
 * Extracts all images from product_images field
 */
export function extractAllImages(productImages: string | string[] | null | undefined): string[] {
  if (!productImages) {
    return ['/images/placeholder-product.jpg'];
  }

  try {
    // If it's a string, try to parse as JSON
    if (typeof productImages === 'string') {
      try {
        const parsed = JSON.parse(productImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean);
        }
      } catch {
        // If parsing fails, return as single-item array if it's a URL
        if (productImages.startsWith('http') || productImages.startsWith('/')) {
          return [productImages];
        }
      }
    }

    // If it's already an array, filter out empty values
    if (Array.isArray(productImages) && productImages.length > 0) {
      return productImages.filter(Boolean);
    }
  } catch (error) {
    console.warn('Failed to extract images:', error);
  }

  return ['/images/placeholder-product.jpg'];
}

/**
 * Gets product image with fallback priority
 */
export function getProductImageUrl(product: any): string {
  // Priority 1: Direct image property (already extracted)
  if (product.image && typeof product.image === 'string' && product.image.trim()) {
    return product.image;
  }

  // Priority 2: Extract from product_images
  if (product.product_images) {
    const extracted = extractFirstImage(product.product_images);
    if (extracted !== '/images/placeholder-product.jpg') {
      return extracted;
    }
  }

  // Priority 3: images array
  if (product.images) {
    const extracted = extractFirstImage(product.images);
    if (extracted !== '/images/placeholder-product.jpg') {
      return extracted;
    }
  }

  // Priority 4: image_url property
  if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim()) {
    return product.image_url;
  }

  // Fallback
  return '/images/placeholder-product.jpg';
}
