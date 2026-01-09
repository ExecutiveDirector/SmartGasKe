// ============================================================
// FILE: src/components/SEO.tsx
// SEO Component for Dynamic Meta Tags (Next.js Pages Router)
// ============================================================

import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "AquaGas - Smart LPG Distribution",
  description = "Experience seamless gas delivery with IoT-enabled cylinders, real-time tracking, and sustainable energy solutions.",
  keywords = "LPG, gas cylinders, gas delivery, smart gas, IoT gas monitoring, AquaGas, Kenya gas",
  image = "/og-image.jpg",
  url = "https://www.aquagas.co.ke",
  type = "website",
  author = "AquaGas",
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const siteTitle = "AquaGas";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const imageUrl = image.startsWith("http") ? image : `${url}${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      {(noindex || nofollow) && (
        <meta
          name="robots"
          content={`${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`}
        />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@aquagas" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#2563eb" />
    </Head>
  );
};

export default SEO;