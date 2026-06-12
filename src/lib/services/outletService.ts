export const outletService = {
  getNearbyOutlets: async (
    params: NearbyOutletsParams
  ): Promise<ApiResponse<Outlet[]>> => {
    const response = await api.get<ApiResponse<Outlet[]>>('/outlets/nearby', { params });
    return response.data;
  },

  // ✅ FIXED: backend returns { outlet: {...} }, unwrap it
  getOutlet: async (outletId: string): Promise<ApiResponse<Outlet>> => {
    const response = await api.get<{ outlet: any }>(`/outlets/${outletId}`);
    const o = response.data.outlet;

    const outlet: Outlet = {
      id: o.outlet_id?.toString() || outletId,
      outlet_id: o.outlet_id,
      name: o.outlet_name || '',
      outlet_name: o.outlet_name,
      vendor: o.vendor_name || '',
      vendor_id: o.vendor_id,
      vendor_name: o.vendor_name,
      rating: o.rating ?? 0,
      reviews: o.reviews ?? 0,
      address: [o.address?.line_1, o.address?.line_2, o.address?.city, o.address?.county]
        .filter(Boolean).join(', '),
      phone: o.phone || '',
      contact_phone: o.phone,
      email: o.email,
      featured: o.featured ?? false,
      latitude: o.location?.lat ?? undefined,
      longitude: o.location?.lng ?? undefined,
      is_active: o.is_active ?? true,
      opening_hours: o.opening_time && o.closing_time
        ? `${o.opening_time} - ${o.closing_time}`
        : undefined,
      isOpen: o.is_open,
    };

    return { success: true, data: outlet };
  },

  getAllOutlets: async (
    params?: OutletQueryParams
  ): Promise<PaginatedResponse<Outlet>> => {
    const response = await api.get<PaginatedResponse<Outlet>>('/outlets', { params });
    return response.data;
  },

  // ✅ FIXED: backend returns a flat object { outlet_id, ..., products: [...], product_count }
  getOutletProducts: async (
    outletId: string,
    params?: OutletProductsParams
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<{
      outlet_id: string;
      outlet_name: string;
      vendor_name: string;
      products: any[];
      product_count: number;
    }>(`/outlets/${outletId}/products`, { params });

    const rawProducts = response.data.products || [];
    const total = response.data.product_count ?? rawProducts.length;

    const products: Product[] = rawProducts.map((p) => ({
      id: p.product_id?.toString() || '',
      product_id: p.product_id,
      name: p.product_name || '',
      title: p.product_name || '',
      product_name: p.product_name || '',
      description: p.description || '',
      price: p.current_price ?? p.price ?? 0,
      base_price: p.current_price ?? p.price ?? 0,
      image: p.image_url || 'https://via.placeholder.com/400x400?text=Product',
      category: p.category || '',
      category_id: p.category_id ? Number(p.category_id) : undefined,
      is_active: p.is_available ?? true,
      isActive: p.is_available ?? true,
      is_featured: false,
      featured: false,
      stock: p.stock_quantity ?? 0,
      inStock: (p.stock_quantity ?? 0) > 0,
      unit: p.unit,
      unit_of_measure: p.unit,
      rating: 0,
      reviews: 0,
      outlet_id: outletId,
      outlet_name: response.data.outlet_name,
      vendor_name: response.data.vendor_name,
    }));

    return {
      success: true,
      data: products,
      pagination: {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || total,
        total,
        pages: 1,
      },
    };
  },

  searchOutlets: async (query: string): Promise<ApiResponse<Outlet[]>> => {
    const response = await api.get<ApiResponse<Outlet[]>>('/outlets/search', {
      params: { q: query },
    });
    return response.data;
  },
};