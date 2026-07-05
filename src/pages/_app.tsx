//  ============================================================
// FILE: src/pages/_app.tsx
// Next.js App Component - Global providers and layout
// ============================================================

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InactivityWarning from '@/components/InactivityWarning'; 
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';

// Optional: Add nprogress for page loading indicator
// npm install nprogress
// npm install --save-dev @types/nprogress

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Detect immersive pages that own their own chrome (nav/footer)
 // const isShopPage = router.pathname.startsWith('/shop');
  const isBlogPage = router.pathname.startsWith('/blog');
  const hideGlobalChrome = isShopPage || isBlogPage;

  // Show loading bar on route changes
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Shop and Blog own their own nav/footer for a fully immersive feel */}
            {!hideGlobalChrome && <Navbar />}

            <main className="flex-grow">
              <Component {...pageProps} />
            </main>

            {!hideGlobalChrome && <Footer />}

            {/* ← shows 1-min warning before auto-logout */}
            <InactivityWarning />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                // Default options
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '16px',
                },

                // Success toast
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                },

                // Error toast
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                },

                // Loading toast
                loading: {
                  duration: Infinity,
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}
