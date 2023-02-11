const BengkelSitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    staging: 'https://proxy-web.stg.otoklix.com',
    production: 'https://otoklix.com'
  }[process.env.NODE_ENV];

  const [workshopRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/workshops/collection/featured`)
  ]);

  const [workshops] = await Promise.all([workshopRes.json()]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${workshops?.data
        .map((item) => {
          return `
            <url>
              <loc>${baseUrl}/bengkel/${item?.slug}</loc>
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

export default BengkelSitemap;
