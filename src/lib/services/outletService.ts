// ============================================================
// FILE: src/lib/services/outletService.ts
// Outlet Service - Wrapper around outlet API calls
// ============================================================

import { outletService as outletApi } from '../api';
import {
  OutletQueryParams,
  NearbyOutletsParams,
  OutletProductsParams,
} from '../types';

class OutletService {
  /**
   * Get nearby outlets based on location
   */
  async getNearbyOutlets(params: NearbyOutletsParams) {
    const response = await outletApi.getNearbyOutlets(params);
    return response;
  }

  /**
   * Get single outlet by ID
   * Now returns a normalized Outlet (unwrapped from { outlet: {...} } in api.ts)
   */
  async getOutlet(outletId: string) {
    const response = await outletApi.getOutlet(outletId);
    return response;
  }

  /**
   * Get all outlets with pagination
   */
  async getAllOutlets(params?: OutletQueryParams) {
    const response = await outletApi.getAllOutlets(params);
    return response;
  }

  /**
   * Get products for a specific outlet
   * Now returns PaginatedResponse<Product> mapped from the backend's
   * flat { products: [...], product_count } response in api.ts
   */
  async getOutletProducts(outletId: string, params?: OutletProductsParams) {
    const response = await outletApi.getOutletProducts(outletId, params);
    return response;
  }

  /**
   * Search outlets by name or location
   */
  async searchOutlets(query: string) {
    const response = await outletApi.searchOutlets(query);
    return response;
  }

  /**
   * Get featured outlets
   */
  async getFeaturedOutlets(limit?: number) {
    const response = await outletApi.getAllOutlets({
      featured: true,
      limit: limit || 10,
    });
    return response;
  }

  /**
   * Get active outlets only
   */
  async getActiveOutlets(params?: OutletQueryParams) {
    const response = await outletApi.getAllOutlets({
      ...params,
      is_active: true,
    });
    return response;
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Sort outlets by distance
   */
  sortByDistance(outlets: any[], userLat: number, userLon: number) {
    return outlets
      .map((outlet) => ({
        ...outlet,
        distance: this.calculateDistance(
          userLat,
          userLon,
          outlet.latitude || 0,
          outlet.longitude || 0
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Filter outlets by rating
   */
  filterByRating(outlets: any[], minRating: number) {
    return outlets.filter((outlet) => outlet.rating >= minRating);
  }
}

export default new OutletService();