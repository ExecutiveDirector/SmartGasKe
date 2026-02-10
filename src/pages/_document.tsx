
// ============================================================
// FILE: src/pages/_document.tsx
// Next.js Document Component - Custom HTML structure
// ============================================================

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Meta Tags */}
        <meta name="description" content="AquaGas - Smart LPG Distribution Platform. Order gas cylinders and accessories with real-time tracking and IoT-enabled monitoring." />
        <meta name="keywords" content="LPG, gas cylinders, gas delivery, smart gas, IoT gas monitoring, AquaGas, Kenya gas" />
        <meta name="author" content="AquaGas" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AquaGas - Smart LPG for a Better Tomorrow" />
        <meta property="og:description" content="Experience seamless gas delivery with IoT-enabled cylinders, real-time tracking, and sustainable energy solutions." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://aquagas.com" />
        <meta property="og:site_name" content="AquaGas" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AquaGas - Smart LPG for a Better Tomorrow" />
        <meta name="twitter:description" content="Experience seamless gas delivery with IoT-enabled cylinders, real-time tracking, and sustainable energy solutions." />
        <meta name="twitter:image" content="/images/twitter-image.jpg" />
        <meta name="twitter:creator" content="@aquagas" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="AquaGas" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AquaGas" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />

        {/* Fonts - Optional: Add custom fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Preload critical resources */}

        {/* Analytics - Add your analytics code here */}
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* NProgress styles for loading bar */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #nprogress {
                pointer-events: none;
              }
              #nprogress .bar {
                background: #2563eb;
                position: fixed;
                z-index: 9999;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
              }
              #nprogress .peg {
                display: block;
                position: absolute;
                right: 0px;
                width: 100px;
                height: 100%;
                box-shadow: 0 0 10px #2563eb, 0 0 5px #2563eb;
                opacity: 1.0;
                transform: rotate(3deg) translate(0px, -4px);
              }
              #nprogress .spinner {
                display: block;
                position: fixed;
                z-index: 9999;
                top: 15px;
                right: 15px;
              }
              #nprogress .spinner-icon {
                width: 18px;
                height: 18px;
                box-sizing: border-box;
                border: solid 2px transparent;
                border-top-color: #2563eb;
                border-left-color: #2563eb;
                border-radius: 50%;
                animation: nprogress-spinner 400ms linear infinite;
              }
              @keyframes nprogress-spinner {
                0%   { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* Optional: Add a noscript fallback */}
        <noscript>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            fontWeight: 'bold',
          }}>
            JavaScript is required to use AquaGas. Please enable JavaScript in your browser.
          </div>
        </noscript>
      </body>
    </Html>
  );
          }
