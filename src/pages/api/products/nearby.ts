// ============================================================
// FILE: src/pages/api/products/nearby.ts
// API endpoint that matches Flutter's ProductService.fetchProducts
// ============================================================

import { NextApiRequest, NextApiResponse } from 'next';

// This should match your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lat, lng, radius = 20 } = req.query;

    // Validate parameters
    if (!lat || !lng) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    // Get auth token from request if needed
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Call your backend API - adjust the endpoint to match your actual API
    // This should return data in the format: { [vendorName]: { [outletId]: OutletProducts } }
    const response = await fetch(
      `${API_BASE_URL}/api/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Backend should return structure like:
    // {
    //   "Vendor A": {
    //     "outlet_1": {
    //       outletId: "outlet_1",
    //       outletName: "Branch 1",
    //       vendorName: "Vendor A",
    //       distance: 2.5,
    //       products: [...]
    //     }
    //   },
    //   "Vendor B": {
    //     "outlet_2": {
    //       outletId: "outlet_2",
    //       outletName: "Branch 2",
    //       vendorName: "Vendor B",
    //       distance: 5.3,
    //       products: [...]
    //     }
    //   }
    // }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// ============================================================
// ALTERNATIVE: If your backend doesn't have this exact endpoint,
// you can transform existing endpoints to match this structure
// ============================================================

// Example transformation function:
export async function transformOutletsToFlutterFormat(
  outlets: any[],
  userLat: number,
  userLng: number
) {
  const result: Record<string, Record<string, any>> = {};

  for (const outlet of outlets) {
    const vendorName = outlet.vendor || 'Unknown Vendor';
    
    if (!result[vendorName]) {
      result[vendorName] = {};
    }

    // Calculate distance if coordinates are available
    let distance: number | undefined;
    if (outlet.latitude && outlet.longitude) {
      distance = calculateDistance(
        userLat,
        userLng,
        outlet.latitude,
        outlet.longitude
      );
    }

    // Fetch products for this outlet
    const products = await fetchOutletProducts(outlet.id);

    result[vendorName][outlet.id] = {
      outletId: outlet.id,
      outletName: outlet.name,
      vendorName: vendorName,
      distance: distance,
      products: products,
    };
  }

  return result;
}

// Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Fetch products for a specific outlet
async function fetchOutletProducts(outletId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/outlets/${outletId}/products`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error(`Error fetching products for outlet ${outletId}:`, error);
    return [];
  }
}
