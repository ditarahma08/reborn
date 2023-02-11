import { listLocation } from '@utils/Constants';

const SitemapGeneral = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    staging: 'https://proxy-web.stg.otoklix.com',
    production: 'https://otoklix.com'
  }[process.env.NODE_ENV];

  const [topServicesRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/product/tags/top-services`)
  ]);

  const [topServices] = await Promise.all([topServicesRes.json()]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${topServices?.data
        .map((item) => {
          const url = item?.tag
            ? `${baseUrl}/servis/${item.category}/${item.tag}`
            : `${baseUrl}/servis/${item.category}`;
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
        ${listLocation
          .map((item) => {
            const url = `${baseUrl}/bengkel/${item.slug}`;
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
