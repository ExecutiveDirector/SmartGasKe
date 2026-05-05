// ============================================================
// FILE: src/pages/checkout/index.tsx
// IMPROVED: Professional design with auto-geolocation & map editor
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Check,
  Loader,
  ArrowLeft,
  AlertCircle,
  Shield,
  Package,
  Edit2,
  X,
  Map,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';
declare global {
  interface Window {
    L: any;
  }
}

const normalizeApiBase = (url: string) => url.replace(/\/$/, '');

// ============================================================
// Location Editor Modal Component
// ============================================================
interface LocationEditorProps {
  isOpen: boolean;
  initialLat: number;
  initialLng: number;
  onConfirm: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

const LocationEditor: React.FC<LocationEditorProps> = ({
  isOpen,
  initialLat,
  initialLng,
  onConfirm,
  onClose,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);
  const [addressFromMap, setAddressFromMap] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load map script on mount
  useEffect(() => {
    if (!isOpen) return;

    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [isOpen]);

  const initMap = () => {
    if (!mapContainerRef.current || !window.L) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = window.L.map(mapContainerRef.current).setView(
      [selectedLat, selectedLng],
      16
    );

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = window.L.marker([selectedLat, selectedLng], {
      draggable: true,
    }).addTo(map);

    // Handle marker drag
    marker.on('drag', () => {
      const pos = marker.getLatLng();
      setSelectedLat(pos.lat);
      setSelectedLng(pos.lng);
    });

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });

    // Handle map clicks
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedLat(lat);
      setSelectedLng(lng);
      marker.setLatLng([lat, lng]);
      reverseGeocode(lat, lng);
    });

    mapRef.current = map;
    setMapLoaded(true);

    // Initial reverse geocode
    reverseGeocode(selectedLat, selectedLng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.address) {
        // Build a readable address
        const addressParts = [
          data.address.road,
          data.address.neighbourhood || data.address.suburb,
          data.address.city || data.address.town,
        ].filter(Boolean);

        const formattedAddress = addressParts.join(', ');
        setAddressFromMap(formattedAddress || 'Location selected');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddressFromMap(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Map size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Edit Location</h3>
              <p className="text-sm text-gray-600">Click on the map or drag the marker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={mapContainerRef}
            className="w-full h-full bg-gray-100"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Address Display & Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Selected Address
            </p>
            <div className="p-4 bg-white border-2 border-blue-200 rounded-xl">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader size={18} className="animate-spin" />
                  <span className="text-sm">Getting address...</span>
                </div>
              ) : (
                <p className="text-gray-800 font-medium">{addressFromMap}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                📍 {selectedLat.toFixed(4)}°, {selectedLng.toFixed(4)}°
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedLat, selectedLng, addressFromMap)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirm Location
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main Checkout Component
// ============================================================
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total: cartTotal, itemCount, clearCart, getCartOutlet } = useCart();
  const { user, isAuthenticated, getToken } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Location state
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLng, setCurrentLng] = useState(0);
  const [mapEditorOpen, setMapEditorOpen] = useState(false);

  // Pricing
  const subtotal = cartTotal;
  const tax = subtotal * 0.6;
  const deliveryFee = subtotal > 5000 ? 0 : 100;
  const total = subtotal + tax + deliveryFee;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    latitude: 0,
    longitude: 0,
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cart, orderPlaced, router]);

  // Auto-detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLocationLoading(true);
        setLocationError('');

        if (!navigator.geolocation) {
          throw new Error('Geolocation not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLat(latitude);
            setCurrentLng(longitude);
            setFormData((prev) => ({
              ...prev,
              latitude,
              longitude,
            }));

            // Reverse geocode to get address
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();

              if (data.address) {
                const addressParts = [
                  data.address.road,
                  data.address.neighbourhood || data.address.suburb,
                  data.address.city || data.address.town,
                ].filter(Boolean);

                const formattedAddress = addressParts.join(', ');
                setFormData((prev) => ({
                  ...prev,
                  address: formattedAddress,
                }));
              }
            } catch (err) {
              console.error('Geocoding error:', err);
            }

            setLocationLoading(false);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            setLocationError(
              'Could not detect your location. Please enter address manually.'
            );
            setLocationLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } catch (error: any) {
        setLocationError(error.message);
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^(\+?254|0)[17]\d{8}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Kenyan phone number (e.g., 0712345678)';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = 'Please provide a delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle location edit confirmation
  const handleLocationConfirm = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lng,
    }));
    setCurrentLat(lat);
    setCurrentLng(lng);
    setMapEditorOpen(false);
    toast.success('Location updated');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);

    try {
      const outlet = getCartOutlet();
      if (!outlet) {
        throw new Error('No outlet found for cart items');
      }

      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const outletId = outlet.id || outlet.outlet_id;
      const vendorId = outlet.vendor_id;

      if (!outletId) {
        throw new Error('Outlet ID is missing');
      }

      const orderData = {
        user_id: user?.id || `guest_${Date.now()}`,
        is_guest: !user || user.id === 'guest',
        outlet_id: outletId,
        vendor_id: vendorId,
        vendor_name: outlet.vendor_name || outlet.name,

        items: cart.map((item) => ({
          product_id: item.id || item.product_id,
          product_name: item.name || item.title || item.product_name,
          quantity: item.quantity,
          unit_price: item.price,
          price: item.price,
        })),

        total_price: total,

        customer_email: formData.email,
        customer_phone: formData.phone,

        delivery_address: formData.address,
        delivery_latitude: formData.latitude,
        delivery_longitude: formData.longitude,
        delivery_notes: formData.notes || '',
      };

      console.log('📦 Creating order:', {
        order_id: newOrderId,
        outlet_id: outletId,
        is_guest: orderData.is_guest,
        total_price: orderData.total_price,
        items_count: orderData.items.length,
        location: `${formData.latitude}, ${formData.longitude}`,
      });

      const token = getToken ? getToken() : null;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Step 1: Create draft order
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      let orderResult: any = null;
      const orderRawResponse = await orderResponse.text();
      try {
        orderResult = orderRawResponse ? JSON.parse(orderRawResponse) : null;
      } catch (parseError) {
        console.error('❌ Failed to parse order response:', parseError);
        orderResult = {
          success: false,
          error: orderRawResponse || 'Invalid response from server',
        };
      }

      if (!orderResponse.ok) {
        console.error('❌ Order creation failed:', orderResult);
        throw new Error(
          orderResult?.error ||
          orderResult?.details ||
          `Failed to create order (HTTP ${orderResponse.status})`
        );
      }

      const createdOrderId = orderResult.order_id || orderResult.order?.order_id || newOrderId;
      setOrderId(createdOrderId);

      console.log('✅ Order created:', {
        order_id: createdOrderId,
        order_number: orderResult.order?.order_number,
      });

      // Step 2: Initiate Pesapal payment
      const paymentPayload = {
        order_id: createdOrderId,
        customer_email: formData.email,
        customer_phone: formData.phone,
      };

      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentPayload),
      });

      let paymentResult;
      try {
        paymentResult = await paymentResponse.json();
      } catch (parseError) {
        console.error('❌ Failed to parse payment response:', parseError);
        throw new Error('Invalid payment response from server');
      }

      if (!paymentResponse.ok) {
        console.error('❌ Payment initiation failed:', paymentResult);
        throw new Error(paymentResult.error || 'Failed to initialize payment');
      }

      if (!paymentResult.success || !paymentResult.redirect_url) {
        throw new Error('Payment redirect URL not received');
      }

      console.log('✅ Redirecting to payment page...');

      clearCart();
      window.location.href = paymentResult.redirect_url;

    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout. Please try again.');
      setSubmitting(false);
    }
  };

  // Success screen
  if (orderPlaced) {
    return (
      <>
        <Head>
          <title>Order Confirmed - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6 text-lg">Thank you for your order</p>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 mb-8">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                Order Number
              </p>
              <p className="text-3xl font-bold text-blue-600 font-mono">
                #{orderId.slice(0, 12).toUpperCase()}
              </p>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              We'll deliver your gas cylinder soon. You can track your order status in your orders page.
            </p>

            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl"
              >
                View My Orders
              </Link>

              <Link
                href="/shop"
                className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield size={18} className="text-emerald-600" />
                <span>Your order is secure and protected</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - AquaGas</title>
        <meta name="description" content="Complete your order for fast gas delivery" />
      </Head>

      <LocationEditor
        isOpen={mapEditorOpen}
        initialLat={currentLat}
        initialLng={currentLng}
        onConfirm={handleLocationConfirm}
        onClose={() => setMapEditorOpen(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition hover:gap-3"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </Link>

            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">Checkout</h1>
              <p className="text-gray-600 text-lg">
                Complete your order for fast, reliable delivery
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <User size={24} className="text-blue-600" />
                    </div>
                    Customer Information
                  </h2>

                  <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-4 top-3.5 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-3.5 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-3.5 text-gray-400"
                          size={20}
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0712345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Format: 0712345678 or +254712345678
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <MapPin size={24} className="text-emerald-600" />
                    </div>
                    Delivery Location
                  </h2>

                  {/* Location Detection Status */}
                  {locationLoading ? (
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center gap-3">
                      <Loader size={20} className="text-blue-600 animate-spin" />
                      <span className="text-gray-700 font-medium">
                        Detecting your location...
                      </span>
                    </div>
                  ) : locationError ? (
                    <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{locationError}</span>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                      <span className="text-gray-700 font-medium">Location detected</span>
                    </div>
                  )}

                  {/* Address Input with Map Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <MapPin
                        className="absolute left-4 top-4 text-gray-400"
                        size={20}
                      />
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                          errors.address ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter your delivery address or use the location editor..."
                      />
                      <button
                        type="button"
                        onClick={() => setMapEditorOpen(true)}
                        className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg group-hover:scale-110 transform duration-200"
                        title="Edit location on map"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.address}
                      </p>
                    )}
                    {formData.latitude !== 0 && formData.longitude !== 0 && (
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        📍 {formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°
                      </p>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Instructions <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="e.g., Ring the doorbell twice, Gate code: 1234..."
                    />
                  </div>
                </div>

                {/* Payment Methods Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={24} className="text-blue-600" />
                    Secure Payment Methods
                  </h3>
                  <p className="text-gray-700 mb-6">
                    After placing your order, you'll be redirected to Pesapal's secure
                    payment page. Choose your preferred payment method:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                      <span>
                        <strong>M-Pesa</strong> - Pay with mobile money
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                      <span>
                        <strong>Credit/Debit Card</strong> - Visa, Mastercard
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                      <span>
                        <strong>Bank Transfer</strong> - Direct bank payment
                      </span>
                    </li>
                  </ul>
                  <div className="p-4 bg-white rounded-xl border-2 border-green-200">
                    <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
                      <Shield size={18} className="text-green-600 flex-shrink-0" />
                      256-bit SSL encryption keeps your payment secure
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || locationLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Check size={24} />
                      Proceed to Payment — KES {total.toFixed(0).toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 font-medium">
                  By placing your order, you agree to our terms and conditions
                </p>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-6 border border-gray-100 hover:shadow-xl transition">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.outlet?.id}`}
                      className="flex items-center gap-3 pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                        <img
                          src={item.image || '/images/placeholder-product.jpg'}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {item.name || item.title}
                        </p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm whitespace-nowrap">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (16%)</span>
                    <span className="font-bold">KES {tax.toFixed(0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-600" />
                      <span className="font-medium">Delivery</span>
                    </div>
                    <span
                      className={`font-bold ${
                        deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      KES {total.toFixed(0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg flex-shrink-0">
                        <Shield size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Secure Checkout</p>
                        <p className="text-xs text-gray-600">Powered by Pesapal</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <Package size={24} className="mx-auto text-blue-600 mb-2" />
                      <p className="text-xs font-semibold text-gray-700">Quality</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <Truck size={24} className="mx-auto text-emerald-600 mb-2" />
                      <p className="text-xs font-semibold text-gray-700">Fast Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
