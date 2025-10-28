import { useLocation } from 'react-router';

const baseUrl = window.location.origin;

const HelmetWrapper = ({
  title,
  description,
  canonicalUrl,
  keywords,
  noIndex,
  ogImage,
  ogImageAlt,
  structuredData,
}) => {
  const location = useLocation();

  const titleFinal = title || 'Moovies';

  const descriptionFinal =
    description || 'Lightweight database for movie exploration';

  const keywordsFinal =
    keywords || 'Movie, database, search movies, advanced search, filters';

  const canonicalUrlFinal =
    canonicalUrl || `${baseUrl}/${location.pathname}${location.search}`;

  const ogImageFinal = ogImage || `${baseUrl}/moovies-poster.webp`;
  const ogImageAltFinal =
    ogImageAlt || 'A cow in a green field surrounded by cameras';

  return (
    <>
      <title>{titleFinal}</title>
      <link rel='canonical' href={canonicalUrlFinal} />
      <meta name='description' content={descriptionFinal} />
      <meta name='keywords' content={keywordsFinal} />

      {/* Crawlers */}
      {noIndex && <meta name='robots' content='noindex, nofollow' />}

      {/* Open Graph */}
      <meta property='og:title' content={titleFinal} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={canonicalUrlFinal} />
      <meta property='og:image' content={ogImageFinal} />
      <meta property='og:image:alt' content={ogImageAltFinal} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={titleFinal} />
      <meta name='twitter:description' content={descriptionFinal} />
      <meta name='twitter:image' content={ogImageFinal} />
      <meta name='twitter:image:alt' content={ogImageAltFinal} />

      {/* Schema.org */}
      {structuredData && (
        <script type='application/ld+json'>
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
};

export default HelmetWrapper;
