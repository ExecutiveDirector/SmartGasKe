import { useState } from 'react';
import Head from 'next/head';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Message sent successfully. Our team will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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

      {/* Header */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Contact AquaGas</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Reach out to us for orders, delivery support, partnerships or general inquiries.
            Our team is ready to help.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Contact Details */}
          <div className="space-y-6">
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Phone</h3>
              </div>
              <p className="text-gray-600 text-sm mb-1">Mon – Sat, 8:00 AM – 8:00 PM</p>
              <a href="tel:+254710820666" className="text-blue-600 font-medium">
                +254 710 820 666
              </a>
            </div>

            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Email</h3>
              </div>
              <p className="text-gray-600 text-sm mb-1">Response within 24 hours</p>
              <a href="mailto:info@aquagas.co.ke" className="text-blue-600 font-medium break-all">
                info@aquagas.co.ke
              </a>
            </div>

            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </div>

            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
              </div>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span>8:00 AM – 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM – 4:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
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

        {/* WhatsApp CTA */}
        <div className="border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Need immediate assistance?
            </h3>
            <p className="text-gray-600 text-sm">
              Chat directly with our support team on WhatsApp.
            </p>
          </div>

          <a
            href="https://wa.me/254710820666"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            <MessageCircle size={18} />
            WhatsApp Chat
          </a>
        </div>
      </section>

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