import { useState } from 'react';
import Head from 'next/head';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ===========================
   Business Hours Logic (EAT)
=========================== */
const isBusinessOpen = () => {
  const now = new Date();
  const kenyaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
  );

  const day = kenyaTime.getDay(); // 0 = Sunday
  const hour = kenyaTime.getHours();

  if (day >= 1 && day <= 5) return hour >= 8 && hour < 20;
  if (day === 6) return hour >= 9 && hour < 18;
  if (day === 0) return hour >= 10 && hour < 16;

  return false;
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openNow = isBusinessOpen();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success(
        'Message sent successfully. Our team will contact you shortly.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <>
      <Head>
        <title>Contact Us | AquaGas Delivery</title>
        <meta
          name="description"
          content="Contact AquaGas Delivery for gas orders, support, partnerships and general inquiries."
        />
      </Head>

      {/* ================= HEADER ================= */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Contact AquaGas
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Reach out to us for gas orders, delivery support, partnerships,
            or general inquiries. Our team is ready to help.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ===== LEFT: CONTACT INFO ===== */}
          <div className="space-y-6">

            {/* Primary Actions */}
            <div className="grid grid-cols-1 gap-4">
              {/* Phone */}
              <div
                className={`flex items-center gap-4 border rounded-xl p-5 transition
                ${openNow
                  ? 'hover:border-blue-600'
                  : 'bg-gray-50 opacity-60'
                }`}
              >
                <Phone className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <p className="font-semibold text-gray-900">
                    +254 710 820 666
                  </p>
                  {openNow ? (
                    <span className="text-xs text-green-600 font-medium">
                      ● Available now
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Available during business hours
                    </span>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/254710820666"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 border rounded-xl p-5 transition
                ${!openNow
                  ? 'border-green-600 bg-green-50'
                  : 'hover:border-green-600'
                }`}
              >
                <MessageCircle className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-semibold text-gray-900">
                    {openNow
                      ? 'Chat with support'
                      : 'Chat with us (recommended)'}
                  </p>
                </div>
              </a>
            </div>

            {/* Email */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-blue-600" />
                <h4 className="font-semibold text-gray-900">Email</h4>
              </div>
              <p className="text-gray-600">info@aquagas.co.ke</p>
              <p className="text-xs text-gray-500 mt-1">
                Response within 24 hours
              </p>
            </div>

            {/* Business Hours */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={18} className="text-blue-600" />
                <h4 className="font-semibold text-gray-900">
                  Business Hours
                </h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Monday – Friday: 8:00 AM – 8:00 PM</li>
                <li>Saturday: 9:00 AM – 6:00 PM</li>
                <li>Sunday: 10:00 AM – 4:00 PM</li>
              </ul>
            </div>

            {/* Location + Map */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={18} className="text-blue-600" />
                <h4 className="font-semibold text-gray-900">Location</h4>
              </div>

              <p className="text-gray-600 mb-3">Nairobi, Kenya</p>

              <div className="rounded-lg overflow-hidden border">
                <iframe
                  title="AquaGas Location"
                  src="https://www.google.com/maps?q=Nairobi,Kenya&output=embed"
                  width="100%"
                  height="220"
                  loading="lazy"
                />
              </div>

              <a
                href="https://www.google.com/maps?q=Nairobi,Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-blue-600 font-medium"
              >
                View on Google Maps →
              </a>
            </div>
          </div>

          {/* ===== RIGHT: CONTACT FORM ===== */}
          <div className="lg:col-span-2 border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select subject</option>
                <option value="order">Order Inquiry</option>
                <option value="delivery">Delivery Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="message"
                rows={5}
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
                className="input resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= INPUT STYLES ================= */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
        }
        .input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
      `}</style>
    </>
  );
}