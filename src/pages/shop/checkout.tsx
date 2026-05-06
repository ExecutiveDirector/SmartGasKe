// ============================================================
// FILE: src/pages/checkout/index.tsx
// UPDATED: Full location improvements — building-level geocoding,
//          GPS re-acquire, manual override, tiered address display,
//          accuracy indicator, zoom=18 Nominatim queries throughout
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
  Edit3,
  X,
  Map,
  Navigation,
  CheckCircle2,
  Building2,
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
// Shared address parsing utility
// Used by both LocationEditor and the checkout auto-detect
// ============================================================
interface ParsedAddress {
  primary: string;   // building / amenity / house+road
  secondary: string; // estate / neighbourhood / suburb
  city: string;      // city / county
  full: string;      // joined string for storage
  coords: string;    // high-precision coords string
}

function parseNominatimAddress(data: any, lat: number, lng: number): ParsedAddress {
  const a = data.address || {};

  const tier1Parts = [
    a.amenity,
    a.tourism,
    a.shop,
    a.building,
    a.office,
    ...(a.house_number && a.road
      ? [`${a.house_number} ${a.road}`]
      : [a.road || a.pedestrian || a.footway || a.path || a.track]),
  ].filter(Boolean);

  const tier2Parts = [
    a.hamlet,
    a.allotments,
    a.quarter,
    a.neighbourhood,
    a.suburb,
    a.village,
  ].filter(Boolean);

  const tier3Parts = [
    a.city_district,
    a.city || a.town || a.municipality,
    a.county,
    a.state,
  ].filter(Boolean);

  const primary   = tier1Parts.slice(0, 2).join(', ');
  const secondary = tier2Parts.slice(0, 2).join(', ');
  const city      = tier3Parts.slice(0, 2).join(', ');

  const fullParts = [primary, secondary, city].filter(Boolean);

  const full =
    fullParts.length >= 2
      ? fullParts.join(', ')
      : (data.display_name || '')
          .split(',')
          .slice(0, 5)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join(', ') || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  const coords = `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;

  return { primary, secondary, city, full, coords };
}

// Shared reverse-geocode call with zoom=18 for building-level detail
async function reverseGeocodeDetailed(lat: number, lng: number): Promise<ParsedAddress> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  return parseNominatimAddress(data, lat, lng);
}

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
  const mapRef          = useRef<any>(null);
  const markerRef       = useRef<any>(null);

  const [selectedLat, setSelectedLat]       = useState(initialLat);
  const [selectedLng, setSelectedLng]       = useState(initialLng);
  const [parsedAddr, setParsedAddr]         = useState<ParsedAddress | null>(null);
  const [manualOverride, setManualOverride] = useState('');
  const [loading, setLoading]               = useState(false);
  const [accuracy, setAccuracy]             = useState<number | null>(null);
  const [gpsLoading, setGpsLoading]         = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLat(initialLat);
      setSelectedLng(initialLng);
      setManualOverride('');
      setAccuracy(null);
    }
  }, [isOpen, initialLat, initialLng]);

  // Load Leaflet CSS + JS
  useEffect(() => {
    if (!isOpen) return;

    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script   = document.createElement('script');
      script.src     = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload  = () => setTimeout(initMap, 50);
      document.body.appendChild(script);
    } else {
      setTimeout(initMap, 50);
    }
  }, [isOpen]);

  const initMap = () => {
    if (!mapContainerRef.current || !window.L) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = window.L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([selectedLat, selectedLng], 17);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom blue pin icon
    const icon = window.L.divIcon({
      className: '',
      html: `<div style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z" fill="#2563eb"/>
          <circle cx="16" cy="16" r="7" fill="white"/>
          <circle cx="16" cy="16" r="4" fill="#2563eb"/>
        </svg>
      </div>`,
      iconSize:   [32, 40],
      iconAnchor: [16, 40],
    });

    const marker = window.L.marker([selectedLat, selectedLng], {
      draggable: true,
      icon,
    }).addTo(map);

    marker.on('drag', () => {
      const pos = marker.getLatLng();
      setSelectedLat(pos.lat);
      setSelectedLng(pos.lng);
    });

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setManualOverride('');
      doReverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedLat(lat);
      setSelectedLng(lng);
      marker.setLatLng([lat, lng]);
      setManualOverride('');
      doReverseGeocode(lat, lng);
    });

    mapRef.current    = map;
    markerRef.current = marker;

    doReverseGeocode(selectedLat, selectedLng);
  };

  const doReverseGeocode = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const parsed = await reverseGeocodeDetailed(lat, lng);
      setParsedAddr(parsed);
    } catch (err) {
      console.error('Reverse geocode error:', err);
      setParsedAddr({
        primary:   '',
        secondary: '',
        city:      '',
        full:      `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        coords:    `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-acquire GPS inside the modal
  const reacquireGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Math.round(acc));
        setSelectedLat(latitude);
        setSelectedLng(longitude);
        setManualOverride('');
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 18);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        doReverseGeocode(latitude, longitude);
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // The address that will be confirmed — manual override takes precedence
  const finalAddress = manualOverride.trim() || parsedAddr?.full || '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Map size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                Pin your delivery location
              </h3>
              <p className="text-xs text-gray-500">Drag the pin or tap the map to adjust</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* ── Map ── */}
        <div className="relative flex-1" style={{ minHeight: 320 }}>
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          {/* GPS re-acquire button overlaid on map */}
          <button
            onClick={reacquireGPS}
            disabled={gpsLoading}
            title="Use my current GPS location"
            className="absolute bottom-4 right-4 z-[1000] w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-blue-50 border border-gray-200 transition disabled:opacity-60"
          >
            {gpsLoading
              ? <Loader size={16} className="animate-spin text-blue-600" />
              : <Navigation size={16} className="text-blue-600" />}
          </button>
        </div>

        {/* ── Address panel ── */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 space-y-4">

          {/* Tiered address display */}
          <div className="bg-white rounded-xl border-2 border-blue-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 px-4 py-4">
                <Loader size={16} className="animate-spin text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-500">Resolving address...</span>
              </div>
            ) : parsedAddr ? (
              <div className="px-4 py-3 space-y-1">
                {parsedAddr.primary ? (
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 leading-snug">
                      {parsedAddr.primary}
                    </span>
                  </div>
                ) : null}
                {parsedAddr.secondary ? (
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-snug">
                      {parsedAddr.secondary}
                    </span>
                  </div>
                ) : null}
                {parsedAddr.city ? (
                  <p className="text-xs text-gray-500 pl-5">{parsedAddr.city}</p>
                ) : null}
                <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-100">
                  <span className="text-[11px] font-mono text-gray-400 tracking-tight">
                    {parsedAddr.coords}
                  </span>
                  {accuracy !== null && (
                    <span className="text-[11px] text-emerald-600 font-medium">
                      ±{accuracy}m accuracy
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">No location selected yet</div>
            )}
          </div>

          {/* Manual override — apartment / floor / gate details */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
              <Edit3 size={12} />
              Add apartment / floor / gate details
            </label>
            <div className="relative">
              <input
                type="text"
                value={manualOverride}
                onChange={(e) => setManualOverride(e.target.value)}
                placeholder={
                  parsedAddr?.full
                    ? `e.g. Apt 4B, 3rd Floor, Blue Gate...`
                    : 'Type your full address here...'
                }
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition placeholder-gray-300"
              />
              {manualOverride && (
                <button
                  onClick={() => setManualOverride('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {manualOverride && (
              <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                This will replace the auto-detected address
              </p>
            )}
          </div>

          {/* Final address preview */}
          {finalAddress ? (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <CheckCircle2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 font-medium leading-relaxed">{finalAddress}</p>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!finalAddress) return;
                onConfirm(selectedLat, selectedLng, finalAddress);
              }}
              disabled={loading || !finalAddress}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader size={15} className="animate-spin" /> Resolving...</>
              ) : (
                <><CheckCircle2 size={15} /> Confirm Location</>
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

  const [submitting, setSubmitting]   = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId]         = useState('');

  // Location state
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError]     = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [currentLat, setCurrentLat]           = useState(0);
  const [currentLng, setCurrentLng]           = useState(0);
  const [mapEditorOpen, setMapEditorOpen]     = useState(false);

  // Pricing
  const subtotal    = cartTotal;
  const tax         = subtotal * 0.06;
  const deliveryFee = subtotal > 5000 ? 0 : 100;
  const total       = subtotal + tax + deliveryFee;

  // Form state
  const [formData, setFormData] = useState({
    name:      '',
    email:     '',
    phone:     '',
    address:   '',
    notes:     '',
    latitude:  0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cart, orderPlaced, router]);

  // ── Auto-detect location on mount ──────────────────────────
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
            const { latitude, longitude, accuracy } = position.coords;
            setCurrentLat(latitude);
            setCurrentLng(longitude);
            setLocationAccuracy(Math.round(accuracy));
            setFormData((prev) => ({ ...prev, latitude, longitude }));

            try {
              // Use the same zoom=18 + full address-field parsing as the modal
              const parsed = await reverseGeocodeDetailed(latitude, longitude);
              setFormData((prev) => ({ ...prev, address: parsed.full }));
            } catch (err) {
              console.error('Geocoding error:', err);
            }

            setLocationLoading(false);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            setLocationError(
              'Could not detect your location. Please enter your address manually or use the map editor.'
            );
            setLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
        name:    user.name    || prev.name,
        email:   user.email   || prev.email,
        phone:   user.phone   || prev.phone,
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

  // Handle location confirmation from modal
  const handleLocationConfirm = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({ ...prev, address, latitude: lat, longitude: lng }));
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
      if (!outlet) throw new Error('No outlet found for cart items');

      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const outletId   = outlet.id || outlet.outlet_id;
      const vendorId   = outlet.vendor_id;

      if (!outletId) throw new Error('Outlet ID is missing');

      const orderData = {
        user_id:     user?.id || `guest_${Date.now()}`,
        is_guest:    !user || user.id === 'guest',
        outlet_id:   outletId,
        vendor_id:   vendorId,
        vendor_name: outlet.vendor_name || outlet.name,

        items: cart.map((item) => ({
          product_id:   item.id || item.product_id,
          product_name: item.name || item.title || item.product_name,
          quantity:     item.quantity,
          unit_price:   item.price,
          price:        item.price,
        })),

        total_price:        total,
        customer_email:     formData.email,
        customer_phone:     formData.phone,
        delivery_address:   formData.address,
        delivery_latitude:  formData.latitude,
        delivery_longitude: formData.longitude,
        delivery_notes:     formData.notes || '',
      };

      const token   = getToken ? getToken() : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Step 1: Create order
      const orderResponse    = await fetch('/api/orders/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      const orderRawResponse = await orderResponse.text();
      let orderResult: any   = null;

      try {
        orderResult = orderRawResponse ? JSON.parse(orderRawResponse) : null;
      } catch {
        orderResult = { success: false, error: orderRawResponse || 'Invalid response from server' };
      }

      if (!orderResponse.ok) {
        throw new Error(
          orderResult?.error || orderResult?.details || `Failed to create order (HTTP ${orderResponse.status})`
        );
      }

      const createdOrderId = orderResult.order_id || orderResult.order?.order_id || newOrderId;
      setOrderId(createdOrderId);

      // Step 2: Initiate Pesapal payment
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_id:       createdOrderId,
          customer_email: formData.email,
          customer_phone: formData.phone,
        }),
      });

      let paymentResult: any;
      try {
        paymentResult = await paymentResponse.json();
      } catch {
        throw new Error('Invalid payment response from server');
      }

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Failed to initialize payment');
      }

      if (!paymentResult.success || !paymentResult.redirect_url) {
        throw new Error('Payment redirect URL not received');
      }

      clearCart();
      window.location.href = paymentResult.redirect_url;

    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Order success screen ────────────────────────────────────
  if (orderPlaced) {
    return (
      <>
        <Head><title>Order Confirmed - AquaGas</title></Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6 text-lg">Thank you for your order</p>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 mb-8">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Order Number</p>
              <p className="text-3xl font-bold text-blue-600 font-mono">
                #{orderId.slice(0, 12).toUpperCase()}
              </p>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">
              We'll deliver your gas cylinder soon. Track your order status on the orders page.
            </p>
            <div className="space-y-3">
              <Link href="/orders" className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg">
                View My Orders
              </Link>
              <Link href="/shop" className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition font-semibold">
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

  // ── Main checkout page ──────────────────────────────────────
  return (
    <>
      <Head>
        <title>Checkout - AquaGas</title>
        <meta name="description" content="Complete your order for fast gas delivery" />
      </Head>

      <LocationEditor
        isOpen={mapEditorOpen}
        initialLat={currentLat || -1.2921}
        initialLng={currentLng || 36.8219}
        onConfirm={handleLocationConfirm}
        onClose={() => setMapEditorOpen(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12">
        <div className="container mx-auto px-4">

          {/* Page header */}
          <div className="mb-12">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition hover:gap-3"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Checkout</h1>
            <p className="text-gray-600 text-lg">
              Complete your order for fast, reliable delivery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Form ── */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Customer Information */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <User size={24} className="text-blue-600" />
                    </div>
                    Customer Information
                  </h2>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />{errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />{errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="0712345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />{errors.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Format: 0712345678 or +254712345678
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <MapPin size={24} className="text-emerald-600" />
                    </div>
                    Delivery Location
                  </h2>

                  {/* Location detection status banner */}
                  {locationLoading ? (
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center gap-3">
                      <Loader size={20} className="text-blue-600 animate-spin flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Detecting your location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-700 text-sm">{locationError}</span>
                        <button
                          type="button"
                          onClick={() => setMapEditorOpen(true)}
                          className="block mt-2 text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Use map to set location →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Location detected</span>
                      </div>
                      {locationAccuracy !== null && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                          ±{locationAccuracy}m
                        </span>
                      )}
                    </div>
                  )}

                  {/* Address textarea + map editor button */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Your address will appear here after location detection..."
                      />
                      <button
                        type="button"
                        onClick={() => setMapEditorOpen(true)}
                        className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        title="Edit location on map"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>

                    {errors.address && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />{errors.address}
                      </p>
                    )}

                    {/* Coordinate badge — shown once we have coords */}
                    {formData.latitude !== 0 && formData.longitude !== 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-mono text-gray-400">
                          {formData.latitude.toFixed(6)}°, {formData.longitude.toFixed(6)}°
                        </span>
                        <span className="text-[11px] text-blue-500 font-medium cursor-pointer hover:underline"
                          onClick={() => setMapEditorOpen(true)}>
                          adjust on map →
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Delivery notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Instructions{' '}
                      <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="e.g. Ring doorbell twice, Gate code: 1234, Leave at reception..."
                    />
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={24} className="text-blue-600" />
                    Secure Payment Methods
                  </h3>
                  <p className="text-gray-700 mb-6">
                    After placing your order, you'll be redirected to Pesapal's secure payment page.
                  </p>
                  <ul className="space-y-3 mb-6">
                    {[
                      { color: 'bg-green-500', label: 'M-Pesa', sub: 'Pay with mobile money' },
                      { color: 'bg-blue-500',  label: 'Credit/Debit Card', sub: 'Visa, Mastercard' },
                      { color: 'bg-purple-500', label: 'Bank Transfer', sub: 'Direct bank payment' },
                    ].map(({ color, label, sub }) => (
                      <li key={label} className="flex items-center gap-3 text-gray-700">
                        <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                          ✓
                        </div>
                        <span><strong>{label}</strong> — {sub}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-white rounded-xl border-2 border-green-200">
                    <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
                      <Shield size={18} className="text-green-600 flex-shrink-0" />
                      256-bit SSL encryption keeps your payment secure
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || locationLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  {submitting ? (
                    <><Loader className="animate-spin" size={24} />Processing Payment...</>
                  ) : (
                    <><Check size={24} />Proceed to Payment — KES {total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 font-medium">
                  By placing your order, you agree to our terms and conditions
                </p>
              </form>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-6 border border-gray-100 hover:shadow-xl transition">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

                {/* Items */}
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

                {/* Pricing */}
                <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (16%)</span>
                    <span className="font-bold">KES {tax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-600" />
                      <span className="font-medium">Delivery</span>
                    </div>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      KES {total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </span>
                  </div>
                </div>

                {/* Trust badges */}
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
