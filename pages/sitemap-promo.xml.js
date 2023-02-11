const SitemapGeneral = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    staging: 'https://proxy-web.stg.otoklix.com',
    production: 'https://otoklix.com'
  }[process.env.NODE_ENV];

  const [promoRes] = await Promise.all([fetch(`${process.env.API_URL}v2/promo/featured`)]);

  const [promos] = await Promise.all([promoRes.json()]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${promos?.data
        .map((item) => {
          const url = item?.redirect_link
            ? item?.redirect_link
            : `${baseUrl}/promo/${item.promo_group_slug}/${item.slug}`;
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default SitemapGeneral;
