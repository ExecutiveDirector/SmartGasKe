// ============================================================
// FILE: src/App.jsx - Main Application Component
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './lib/context/CartContext';
import { CartProvider } from './lib/context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - Import your page components here
// Main Pages
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import FounderPage from './pages/Founder';
import HowItWorksPage from './pages/HowItWorks';
import TechnologyPage from './pages/Technology';
import InvestorsPage from './pages/Investors';
import PartnersPage from './pages/Partners';
import ContactPage from './pages/Contact';

// Shop Pages
import ShopPage from './pages/shop/Shop';
import VendorPage from './pages/shop/VendorPage';
import CartPage from './pages/shop/Cart';
import CheckoutPage from './pages/shop/Checkout';

// Order Pages
import OrdersPage from './pages/orders/Orders';
import OrderDetailPage from './pages/orders/OrderDetail';

// Account Pages
import LoginPage from './pages/account/Login';
import AccountPage from './pages/account/Account';
import ProfilePage from './pages/account/Profile';
import WalletPage from './pages/account/Wallet';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/technology" element={<TechnologyPage />} />
                <Route path="/investors" element={<InvestorsPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Shop Pages */}
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:vendorId" element={<VendorPage />} />
                <Route path="/shop/cart" element={<CartPage />} />
                <Route path="/shop/checkout" element={<CheckoutPage />} />

                {/* Order Pages */}
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />

                {/* Account Pages */}
                <Route path="/account/login" element={<LoginPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/wallet" element={<WalletPage />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '16px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// 404 Not Found Component
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            ← Go Back
          </button>
          <a
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
