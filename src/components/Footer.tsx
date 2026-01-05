// src/components/Footer.tsx

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Aqua<span className="text-orange-500">Gas</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed">
              Fast, safe & reliable cooking gas delivery across Nairobi.
              Order refills or cylinders and get them delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/shop" className="hover:text-white transition">Order Gas</a></li>
              <li><a href="/track" className="hover:text-white transition">Track Order</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>📍 Nairobi, Kenya</li>
              <li>📞 +254 710 820 666</li>
              <li>✉️ info@aquagas.co.ke</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            © {year} AquaGas Delivery. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">X</a>
            <a href="#" className="hover:text-white transition">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}