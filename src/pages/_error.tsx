// ============================================================
// FILE: src/pages/_error.tsx
// Custom Error Page (Optional but recommended)
// ============================================================

import { NextPageContext } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          {statusCode || 'Error'}
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {statusCode === 404
            ? 'Page Not Found'
            : statusCode === 500
            ? 'Server Error'
            : 'An Error Occurred'}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {statusCode === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : 'Something went wrong on our end. Please try again later.'}
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

