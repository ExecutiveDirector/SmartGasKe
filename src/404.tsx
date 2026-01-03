// ============================================================
// FILE: src/pages/404.tsx
// Custom 404 Page
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found | AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track!
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-transparent hover:border-blue-600"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-semibold text-gray-800">Home</div>
            </Link>
            <Link
              href="/shop"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-transparent hover:border-blue-600"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-semibold text-gray-800">Shop</div>
            </Link>
            <Link
              href="/contact"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-transparent hover:border-blue-600"
            >
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold text-gray-800">Contact</div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              ← Go Back
            </button>
            <Link
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
