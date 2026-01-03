// ============================================================
// FILE: src/pages/500.tsx
// Custom 500 Error Page
// ============================================================

import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error | AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="text-9xl font-bold text-red-600 mb-4">500</div>
            <div className="text-6xl mb-4">⚠️</div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Server Error
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Something went wrong on our end. We're working to fix it.
            Please try again later.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Reload Page
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
