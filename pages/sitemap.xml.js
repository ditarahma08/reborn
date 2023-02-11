const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    staging: 'https://proxy-web.stg.otoklix.com',
    production: 'https://otoklix.com'
  }[process.env.NODE_ENV];

  const sitemap = `
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${baseUrl}/sitemap-general.xml</loc>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-bengkel-part1.xml</loc>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-promo.xml</loc>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-dynamic-search.xml</loc>
      </sitemap>
    </sitemapindex>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default Sitemap;
