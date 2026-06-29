// ============================================================
// FILE: src/pages/shop/checkout.tsx
// UPDATED: Delivery type selector (Home Delivery / Pickup),
//          ASAP vs Scheduled with date + time slots,
//          Outlet picker for pickup (free delivery),
//          All fields saved to orders table
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User, Mail, Phone, MapPin, Truck, Check, Loader, ArrowLeft,
  AlertCircle, Shield, Package, Edit2, Edit3, X, Map, Navigation,
  CheckCircle2, Building2, Clock, Calendar, Store, ChevronRight,
  Zap, CalendarClock,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';
import { calculateCartPricing } from '@/lib/utils/pricing';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

declare global {
  interface Window { L: any; }
}

// ── Time slots available for scheduling ────────────────────
const TIME_SLOTS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
  '06:00 PM – 08:00 PM',
];

// Generate next 7 available days (skip today if after 6pm)
function getAvailableDates(): { label: string; value: string; sub: string }[] {
  const dates = [];
  const now = new Date();
  const startOffset = now.getHours() >= 18 ? 1 : 0; // if after 6pm, start tomorrow

  for (let i = startOffset; i < startOffset + 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-KE', { weekday: 'long' });
    const sub = d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
    const value = d.toISOString().split('T')[0]; // YYYY-MM-DD
    dates.push({ label, value, sub });
  }
  return dates;
}

// ── Address parsing (unchanged from original) ──────────────
interface ParsedAddress {
  primary: string; secondary: string; city: string; full: string; coords: string;
}

function parseNominatimAddress(data: any, lat: number, lng: number): ParsedAddress {
  const a = data.address || {};
  const tier1Parts = [a.amenity, a.tourism, a.shop, a.building, a.office,
    ...(a.house_number && a.road ? [`${a.house_number} ${a.road}`] : [a.road || a.pedestrian || a.footway || a.path || a.track])
  ].filter(Boolean);
  const tier2Parts = [a.hamlet, a.allotments, a.quarter, a.neighbourhood, a.suburb, a.village].filter(Boolean);
  const tier3Parts = [a.city_district, a.city || a.town || a.municipality, a.county, a.state].filter(Boolean);
  const primary   = tier1Parts.slice(0, 2).join(', ');
  const secondary = tier2Parts.slice(0, 2).join(', ');
  const city      = tier3Parts.slice(0, 2).join(', ');
  const fullParts = [primary, secondary, city].filter(Boolean);
  const full = fullParts.length >= 2
    ? fullParts.join(', ')
    : (data.display_name || '').split(',').slice(0, 5).map((s: string) => s.trim()).filter(Boolean).join(', ')
      || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  return { primary, secondary, city, full, coords: `${lat.toFixed(6)}°, ${lng.toFixed(6)}°` };
}

async function reverseGeocodeDetailed(lat: number, lng: number): Promise<ParsedAddress> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  return parseNominatimAddress(data, lat, lng);
}

// ── Location Editor Modal (unchanged from original) ────────
interface LocationEditorProps {
  isOpen: boolean; initialLat: number; initialLng: number;
  onConfirm: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

const LocationEditor: React.FC<LocationEditorProps> = ({ isOpen, initialLat, initialLng, onConfirm, onClose }) => {
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

  useEffect(() => {
    if (isOpen) { setSelectedLat(initialLat); setSelectedLng(initialLng); setManualOverride(''); setAccuracy(null); }
  }, [isOpen, initialLat, initialLng]);

  useEffect(() => {
    if (!isOpen) return;
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link'); link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => setTimeout(initMap, 50);
      document.body.appendChild(script);
    } else { setTimeout(initMap, 50); }
  }, [isOpen]);

  const initMap = () => {
    if (!mapContainerRef.current || !window.L) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    const map = window.L.map(mapContainerRef.current, { zoomControl: true }).setView([selectedLat, selectedLng], 17);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
    const icon = window.L.divIcon({
      className: '',
      html: `<div style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))"><svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z" fill="#2563eb"/><circle cx="16" cy="16" r="7" fill="white"/><circle cx="16" cy="16" r="4" fill="#2563eb"/></svg></div>`,
      iconSize: [32, 40], iconAnchor: [16, 40],
    });
    const marker = window.L.marker([selectedLat, selectedLng], { draggable: true, icon }).addTo(map);
    marker.on('drag', () => { const p = marker.getLatLng(); setSelectedLat(p.lat); setSelectedLng(p.lng); });
    marker.on('dragend', () => { const p = marker.getLatLng(); setManualOverride(''); doReverseGeocode(p.lat, p.lng); });
    map.on('click', (e: any) => { const { lat, lng } = e.latlng; setSelectedLat(lat); setSelectedLng(lng); marker.setLatLng([lat, lng]); setManualOverride(''); doReverseGeocode(lat, lng); });
    mapRef.current = map; markerRef.current = marker;
    doReverseGeocode(selectedLat, selectedLng);
  };

  const doReverseGeocode = async (lat: number, lng: number) => {
    try { setLoading(true); const parsed = await reverseGeocodeDetailed(lat, lng); setParsedAddr(parsed); }
    catch { setParsedAddr({ primary: '', secondary: '', city: '', full: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, coords: `${lat.toFixed(6)}°, ${lng.toFixed(6)}°` }); }
    finally { setLoading(false); }
  };

  const reacquireGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Math.round(acc)); setSelectedLat(latitude); setSelectedLng(longitude); setManualOverride('');
        if (mapRef.current && markerRef.current) { mapRef.current.setView([latitude, longitude], 18); markerRef.current.setLatLng([latitude, longitude]); }
        doReverseGeocode(latitude, longitude); setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const finalAddress = manualOverride.trim() || parsedAddr?.full || '';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '92vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0"><Map size={18} className="text-white" /></div>
            <div><h3 className="text-base font-bold text-gray-900">Pin your delivery location</h3><p className="text-xs text-gray-500">Drag the pin or tap the map to adjust</p></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"><X size={18} className="text-gray-500" /></button>
        </div>
        <div className="relative flex-1" style={{ minHeight: 320 }}>
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          <button onClick={reacquireGPS} disabled={gpsLoading} title="Use my GPS" className="absolute bottom-4 right-4 z-[1000] w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-blue-50 border border-gray-200 transition disabled:opacity-60">
            {gpsLoading ? <Loader size={16} className="animate-spin text-blue-600" /> : <Navigation size={16} className="text-blue-600" />}
          </button>
        </div>
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 space-y-4">
          <div className="bg-white rounded-xl border-2 border-blue-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 px-4 py-4"><Loader size={16} className="animate-spin text-blue-500 flex-shrink-0" /><span className="text-sm text-gray-500">Resolving address...</span></div>
            ) : parsedAddr ? (
              <div className="px-4 py-3 space-y-1">
                {parsedAddr.primary && <div className="flex items-start gap-2"><Building2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span className="text-sm font-semibold text-gray-900">{parsedAddr.primary}</span></div>}
                {parsedAddr.secondary && <div className="flex items-start gap-2"><MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-700">{parsedAddr.secondary}</span></div>}
                {parsedAddr.city && <p className="text-xs text-gray-500 pl-5">{parsedAddr.city}</p>}
                <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-100">
                  <span className="text-[11px] font-mono text-gray-400">{parsedAddr.coords}</span>
                  {accuracy !== null && <span className="text-[11px] text-emerald-600 font-medium">±{accuracy}m accuracy</span>}
                </div>
              </div>
            ) : <div className="px-4 py-3 text-sm text-gray-400">No location selected yet</div>}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5"><Edit3 size={12} />Add apartment / floor / gate details</label>
            <div className="relative">
              <input type="text" value={manualOverride} onChange={(e) => setManualOverride(e.target.value)}
                placeholder={parsedAddr?.full ? 'e.g. Apt 4B, 3rd Floor, Blue Gate...' : 'Type your full address here...'}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition placeholder-gray-300" />
              {manualOverride && <button onClick={() => setManualOverride('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
            </div>
          </div>
          {finalAddress && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <CheckCircle2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 font-medium">{finalAddress}</p>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition">Cancel</button>
            <button onClick={() => { if (!finalAddress) return; onConfirm(selectedLat, selectedLng, finalAddress); }}
              disabled={loading || !finalAddress}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader size={15} className="animate-spin" /> Resolving...</> : <><CheckCircle2 size={15} /> Confirm Location</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Outlet Card for Pickup ──────────────────────────────────
interface OutletCardProps {
  outlet: any;
  selected: boolean;
  onSelect: () => void;
}

const OutletCard: React.FC<OutletCardProps> = ({ outlet, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
      selected
        ? 'border-emerald-500 bg-emerald-50 shadow-md'
        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${selected ? 'bg-emerald-500' : 'bg-gray-100'}`}>
        <Store size={18} className={selected ? 'text-white' : 'text-gray-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-gray-900 text-sm">{outlet.outlet_name || outlet.name}</p>
          {selected && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {outlet.address_line_1 || outlet.address}{outlet.city ? `, ${outlet.city}` : ''}
        </p>
        {outlet.contact_phone && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Phone size={10} />{outlet.contact_phone}
          </p>
        )}
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-semibold">
          <Check size={10} />FREE Pickup
        </div>
      </div>
    </div>
  </button>
);

// ── Main Checkout Component ─────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total: cartTotal, itemCount, clearCart, getCartOutlet } = useCart();
  const { user, isAuthenticated, getToken } = useAuth();

  const [submitting, setSubmitting]   = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId]         = useState('');

  // ── Delivery type state ────────────────────────────────────
  // 'home_delivery' | 'pickup'
  const [deliveryMode, setDeliveryMode] = useState<'home_delivery' | 'pickup'>('home_delivery');
  // 'asap' | 'scheduled'
  const [scheduleType, setScheduleType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState<any>(null);
  const [outlets, setOutlets]              = useState<any[]>([]);
  const [outletsLoading, setOutletsLoading] = useState(false);

  // ── Location state ─────────────────────────────────────────
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError]     = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [currentLat, setCurrentLat]           = useState(0);
  const [currentLng, setCurrentLng]           = useState(0);
  const [mapEditorOpen, setMapEditorOpen]     = useState(false);

  // ── Pricing ────────────────────────────────────────────────
  const { subtotal, tax, deliveryFee: baseFee, total } = calculateCartPricing(cartTotal);
  // Pickup is always free
  const deliveryFee = deliveryMode === 'pickup' ? 0 : baseFee;
  const finalTotal  = subtotal + tax + deliveryFee;

  // ── Form state ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', notes: '', latitude: 0, longitude: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) router.push('/cart');
  }, [cart, orderPlaced, router]);

  // Auto-detect location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLocationLoading(true); setLocationError('');
        if (!navigator.geolocation) throw new Error('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setCurrentLat(latitude); setCurrentLng(longitude); setLocationAccuracy(Math.round(accuracy));
            setFormData((prev) => ({ ...prev, latitude, longitude }));
            try {
              const parsed = await reverseGeocodeDetailed(latitude, longitude);
              setFormData((prev) => ({ ...prev, address: parsed.full }));
            } catch { /* silent */ }
            setLocationLoading(false);
          },
          (error) => {
            setLocationError('Could not detect your location. Please enter manually or use the map editor.');
            setLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } catch (error: any) {
        setLocationError(error.message); setLocationLoading(false);
      }
    };
    detectLocation();
  }, []);

  // Pre-fill user data
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

  // Load outlets when pickup mode selected
  useEffect(() => {
    if (deliveryMode !== 'pickup') return;
    const outlet = getCartOutlet?.();
    if (outlet) {
      // Use the cart's outlet directly
      setOutlets([outlet]);
      setSelectedOutlet(outlet);
      return;
    }
    // Fallback: fetch from API
    const fetchOutlets = async () => {
      setOutletsLoading(true);
      try {
        const token = getToken ? getToken() : null;
        const res = await fetch(`${API_URL}/outlets`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.outlets || data.data || data || [];
          setOutlets(list);
          if (list.length === 1) setSelectedOutlet(list[0]);
        }
      } catch { /* silent */ } finally { setOutletsLoading(false); }
    };
    fetchOutlets();
  }, [deliveryMode]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^(\+?254|0)[17]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid Kenyan phone number';

    if (deliveryMode === 'home_delivery') {
      if (!formData.address || formData.address.trim().length < 5) newErrors.address = 'Please provide a delivery address';
      if (scheduleType === 'scheduled') {
        if (!scheduledDate) newErrors.scheduledDate = 'Please select a delivery date';
        if (!scheduledSlot) newErrors.scheduledSlot = 'Please select a time slot';
      }
    }

    if (deliveryMode === 'pickup' && !selectedOutlet) {
      newErrors.outlet = 'Please select a pickup outlet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationConfirm = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({ ...prev, address, latitude: lat, longitude: lng }));
    setCurrentLat(lat); setCurrentLng(lng);
    setMapEditorOpen(false);
    toast.success('Location updated');
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fix the errors in the form'); return; }
    setSubmitting(true);

    try {
      const outlet = getCartOutlet?.() || selectedOutlet;
      if (!outlet) throw new Error('No outlet found for cart items');

      const outletId = outlet.id || outlet.outlet_id;
      const vendorId = outlet.vendor_id;
      if (!outletId) throw new Error('Outlet ID is missing');

      // Build scheduled_at timestamp
      let scheduled_at: string | null = null;
      if (deliveryMode === 'home_delivery' && scheduleType === 'scheduled' && scheduledDate && scheduledSlot) {
        // e.g. "2025-12-01T08:00:00" — store start of slot
        const slotStart = scheduledSlot.split('–')[0].trim(); // "08:00 AM"
        const [time, period] = slotStart.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        scheduled_at = `${scheduledDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      }

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

        subtotal,
        tax_amount:  tax,
        delivery_fee: deliveryFee,
        total_amount: finalTotal,
        total_price:  finalTotal,

        // Delivery type fields — saved to orders table
        delivery_type:    deliveryMode === 'pickup' ? 'pickup' : scheduleType === 'scheduled' ? 'scheduled' : 'home_delivery',
        schedule_type:    deliveryMode === 'home_delivery' ? scheduleType : null,  // 'asap' | 'scheduled'
        scheduled_at,          // null for asap/pickup
        scheduled_time_slot:   scheduleType === 'scheduled' ? scheduledSlot : null,

        // Address fields (home delivery)
        delivery_address:   deliveryMode === 'home_delivery' ? formData.address : null,
        delivery_latitude:  deliveryMode === 'home_delivery' ? formData.latitude  : null,
        delivery_longitude: deliveryMode === 'home_delivery' ? formData.longitude : null,
        delivery_notes:     formData.notes || '',

        // Pickup outlet (if pickup)
        pickup_outlet_id:   deliveryMode === 'pickup' ? outletId : null,
        pickup_outlet_name: deliveryMode === 'pickup' ? (outlet.outlet_name || outlet.name) : null,
        pickup_address:     deliveryMode === 'pickup'
          ? `${outlet.address_line_1 || ''}, ${outlet.city || ''}`.trim()
          : null,

        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_contact: formData.phone,
      };

      const token   = getToken ? getToken() : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const orderResponse    = await fetch('/api/orders/create', { method: 'POST', headers, body: JSON.stringify(orderData) });
      const orderRawResponse = await orderResponse.text();
      let orderResult: any   = null;
      try { orderResult = orderRawResponse ? JSON.parse(orderRawResponse) : null; }
      catch { orderResult = { success: false, error: orderRawResponse || 'Invalid response' }; }

      if (!orderResponse.ok) throw new Error(orderResult?.error || orderResult?.details || `HTTP ${orderResponse.status}`);

      const createdOrderId = orderResult.order_id || orderResult.order?.order_id || `ORD-${Date.now()}`;
      setOrderId(createdOrderId);

      // Pesapal payment
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST', headers,
        body: JSON.stringify({ order_id: createdOrderId, customer_email: formData.email, customer_phone: formData.phone }),
      });
      let paymentResult: any;
      try { paymentResult = await paymentResponse.json(); }
      catch { throw new Error('Invalid payment response'); }

      if (!paymentResponse.ok) throw new Error(paymentResult.error || 'Payment failed');
      if (!paymentResult.success || !paymentResult.redirect_url) throw new Error('Payment redirect URL not received');

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
              <p className="text-3xl font-bold text-blue-600 font-mono">#{orderId.slice(0, 12).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <Link href="/orders" className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg">View My Orders</Link>
              <Link href="/shop" className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition font-semibold">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const availableDates = getAvailableDates();

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
          <div className="mb-10">
            <Link href="/shop/cart" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition hover:gap-3">
              <ArrowLeft size={20} />Back to Cart
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-500 text-lg">Complete your order for fast, reliable delivery</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Form ── */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── STEP 1: Customer Information ── */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">1</div>
                    Customer Information
                  </h2>
                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="Jane Wanjiru" />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="you@example.com" />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="0712 345 678" />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
                      <p className="text-xs text-gray-400 mt-1.5">Format: 0712345678 or +254712345678</p>
                    </div>
                  </div>
                </div>

                {/* ── STEP 2: Delivery Method ── */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">2</div>
                    Delivery Method
                  </h2>

                  {/* Toggle: Home Delivery vs Pickup */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {/* Home Delivery */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('home_delivery')}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        deliveryMode === 'home_delivery'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      {deliveryMode === 'home_delivery' && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </span>
                      )}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${deliveryMode === 'home_delivery' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <Truck size={22} className={deliveryMode === 'home_delivery' ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <p className="font-bold text-gray-900 text-sm">Home Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Delivered to your door</p>
                    </button>

                    {/* Pickup */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('pickup')}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        deliveryMode === 'pickup'
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                      }`}
                    >
                      {deliveryMode === 'pickup' && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </span>
                      )}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${deliveryMode === 'pickup' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        <Store size={22} className={deliveryMode === 'pickup' ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <p className="font-bold text-gray-900 text-sm">Pickup</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">FREE — No delivery fee</p>
                    </button>
                  </div>

                  {/* ── Home Delivery section ── */}
                  {deliveryMode === 'home_delivery' && (
                    <div className="space-y-6">

                      {/* ASAP vs Scheduled toggle */}
                      <div>
                        <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Clock size={15} className="text-blue-500" />When do you need it?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {/* ASAP */}
                          <button
                            type="button"
                            onClick={() => setScheduleType('asap')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              scheduleType === 'asap'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Zap size={16} className={scheduleType === 'asap' ? 'text-blue-500' : 'text-gray-400'} />
                              <span className="font-bold text-sm text-gray-900">Deliver ASAP</span>
                              {scheduleType === 'asap' && <CheckCircle2 size={14} className="text-blue-500 ml-auto" />}
                            </div>
                            <p className="text-xs text-gray-500 ml-6">30 – 60 minutes</p>
                          </button>

                          {/* Schedule */}
                          <button
                            type="button"
                            onClick={() => setScheduleType('scheduled')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              scheduleType === 'scheduled'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <CalendarClock size={16} className={scheduleType === 'scheduled' ? 'text-blue-500' : 'text-gray-400'} />
                              <span className="font-bold text-sm text-gray-900">Schedule</span>
                              {scheduleType === 'scheduled' && <CheckCircle2 size={14} className="text-blue-500 ml-auto" />}
                            </div>
                            <p className="text-xs text-gray-500 ml-6">Pick date & time</p>
                          </button>
                        </div>
                      </div>

                      {/* ASAP info badge */}
                      {scheduleType === 'asap' && (
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Express Delivery</p>
                            <p className="text-xs text-gray-500 mt-0.5">Your order will be delivered within <span className="font-semibold text-blue-600">30 – 60 minutes</span> of confirmation</p>
                          </div>
                        </div>
                      )}

                      {/* Scheduling UI */}
                      {scheduleType === 'scheduled' && (
                        <div className="space-y-5 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={15} className="text-blue-500" />Choose delivery date
                          </p>

                          {/* Date selector */}
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {availableDates.map((d) => (
                              <button
                                key={d.value}
                                type="button"
                                onClick={() => setScheduledDate(d.value)}
                                className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 text-center transition-all duration-150 min-w-[80px] ${
                                  scheduledDate === d.value
                                    ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                    : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                                }`}
                              >
                                <p className="text-xs font-bold">{d.label}</p>
                                <p className={`text-[11px] mt-0.5 ${scheduledDate === d.value ? 'text-blue-100' : 'text-gray-400'}`}>{d.sub}</p>
                              </button>
                            ))}
                          </div>
                          {errors.scheduledDate && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.scheduledDate}</p>}

                          {/* Time slot selector */}
                          {scheduledDate && (
                            <div>
                              <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Clock size={15} className="text-blue-500" />Choose time slot
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setScheduledSlot(slot)}
                                    className={`px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all duration-150 text-center ${
                                      scheduledSlot === slot
                                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                        : 'border-gray-200 bg-white hover:border-blue-300 text-gray-600'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                              {errors.scheduledSlot && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.scheduledSlot}</p>}
                            </div>
                          )}

                          {/* Summary pill */}
                          {scheduledDate && scheduledSlot && (
                            <div className="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-xl">
                              <CalendarClock size={16} />
                              <p className="text-xs font-semibold">
                                Scheduled for {availableDates.find(d => d.value === scheduledDate)?.label} · {scheduledSlot}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Delivery address */}
                      <div>
                        <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <MapPin size={15} className="text-blue-500" />Delivery Address
                        </p>

                        {locationLoading ? (
                          <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center gap-3">
                            <Loader size={18} className="text-blue-600 animate-spin flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">Detecting your location...</span>
                          </div>
                        ) : locationError ? (
                          <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
                            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-700">{locationError}</p>
                              <button type="button" onClick={() => setMapEditorOpen(true)} className="mt-1.5 text-xs font-semibold text-blue-600 hover:underline">Use map to set location →</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                              <span className="text-sm text-gray-700 font-medium">Location detected</span>
                            </div>
                            {locationAccuracy !== null && (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">±{locationAccuracy}m</span>
                            )}
                          </div>
                        )}

                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className={`w-full pl-11 pr-14 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="Your delivery address..." />
                          <button type="button" onClick={() => setMapEditorOpen(true)}
                            className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md" title="Edit on map">
                            <Edit2 size={16} />
                          </button>
                        </div>
                        {errors.address && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.address}</p>}
                        {formData.latitude !== 0 && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[11px] font-mono text-gray-400">{formData.latitude.toFixed(6)}°, {formData.longitude.toFixed(6)}°</span>
                            <button type="button" onClick={() => setMapEditorOpen(true)} className="text-[11px] text-blue-500 hover:underline">adjust →</button>
                          </div>
                        )}
                      </div>

                      {/* Delivery notes */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Instructions <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                        <textarea rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-sm"
                          placeholder="e.g. Ring doorbell twice, Gate code: 1234, Call on arrival..." />
                      </div>
                    </div>
                  )}

                  {/* ── Pickup section ── */}
                  {deliveryMode === 'pickup' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Store size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Choose a Pickup Location</p>
                          <p className="text-xs text-gray-500 mt-0.5">No delivery fee — pick up your order at a nearby outlet</p>
                        </div>
                      </div>

                      {outletsLoading ? (
                        <div className="flex items-center gap-3 py-6 justify-center text-gray-500">
                          <Loader size={18} className="animate-spin" /><span className="text-sm">Loading outlets...</span>
                        </div>
                      ) : outlets.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">No outlets available for pickup at this time.</div>
                      ) : (
                        <div className="space-y-3">
                          {outlets.map((outlet: any) => (
                            <OutletCard
                              key={outlet.outlet_id || outlet.id}
                              outlet={outlet}
                              selected={selectedOutlet?.outlet_id === outlet.outlet_id || selectedOutlet?.id === outlet.id}
                              onSelect={() => setSelectedOutlet(outlet)}
                            />
                          ))}
                        </div>
                      )}

                      {errors.outlet && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.outlet}</p>}

                      {/* Pickup notes */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Notes <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                        <textarea rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none text-sm"
                          placeholder="e.g. Will arrive around 2pm, Calling ahead..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Payment info ── */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-7">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={22} className="text-blue-600" />Secure Payment
                  </h3>
                  <p className="text-gray-700 text-sm mb-5">After placing your order, you'll be redirected to Pesapal's secure payment page.</p>
                  <div className="space-y-2.5 mb-5">
                    {[
                      { color: 'bg-green-500', label: 'M-Pesa', sub: 'Mobile money' },
                      { color: 'bg-blue-500',  label: 'Card',   sub: 'Visa / Mastercard' },
                      { color: 'bg-purple-500', label: 'Bank',  sub: 'Direct transfer' },
                    ].map(({ color, label, sub }) => (
                      <div key={label} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className={`w-7 h-7 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>✓</div>
                        <span><strong>{label}</strong> — {sub}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-green-200">
                    <p className="text-xs text-gray-700 flex items-center gap-2 font-medium"><Shield size={14} className="text-green-600" />256-bit SSL encryption</p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || locationLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.01] active:scale-[0.99] duration-200"
                >
                  {submitting
                    ? <><Loader className="animate-spin" size={22} />Processing...</>
                    : <><Check size={22} />Proceed to Payment — KES {finalTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</>
                  }
                </button>
                <p className="text-center text-xs text-gray-500">By placing your order, you agree to our terms and conditions</p>
              </form>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-7 sticky top-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-56 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.outlet?.id}`} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                        <img src={item.image || '/images/placeholder-product.jpg'} alt={item.name || item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">{item.name || item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery method summary */}
                <div className="mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2">
                    {deliveryMode === 'home_delivery'
                      ? <><Truck size={14} className="text-blue-500" /><span className="text-xs font-semibold text-gray-700">Home Delivery</span></>
                      : <><Store size={14} className="text-emerald-500" /><span className="text-xs font-semibold text-gray-700">Pickup</span></>
                    }
                  </div>
                  {deliveryMode === 'home_delivery' && (
                    <p className="text-[11px] text-gray-400 mt-1 ml-5">
                      {scheduleType === 'asap'
                        ? 'Express — 30 to 60 minutes'
                        : scheduledDate && scheduledSlot
                          ? `${availableDates.find(d => d.value === scheduledDate)?.label} · ${scheduledSlot}`
                          : 'Scheduled — select date & time'
                      }
                    </p>
                  )}
                  {deliveryMode === 'pickup' && selectedOutlet && (
                    <p className="text-[11px] text-gray-400 mt-1 ml-5">{selectedOutlet.outlet_name || selectedOutlet.name}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-5 pb-5 border-b-2 border-gray-100">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span><span className="font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Service fee</span><span className="font-bold">KES {tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-1.5"><Truck size={14} className="text-emerald-600" /><span>Delivery</span></div>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">KES {finalTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Package size={20} className="mx-auto text-blue-600 mb-1" />
                    <p className="text-[11px] font-semibold text-gray-700">Quality</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Shield size={20} className="mx-auto text-emerald-600 mb-1" />
                    <p className="text-[11px] font-semibold text-gray-700">Secure</p>
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
