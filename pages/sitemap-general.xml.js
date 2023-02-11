import fs from 'fs';

const SitemapGeneral = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    staging: 'https://proxy-web.stg.otoklix.com',
    production: 'https://otoklix.com'
  }[process.env.NODE_ENV];

  const staticPages = fs
    .readdirSync('pages')
    .filter((staticPage) => {
      return ![
        'index.js',
        '_app.js',
        '_document.js',
        '_error.js',
        'sitemap.xml.js',
        'sitemap-general.xml.js',
        'sitemap-bengkel-part1.xml.js',
        'account',
        'auth',
        'api',
        'batal-pesan',
        'refund',
        'ubah-jadwal',
        'verifikasi',
        'forgot-auth',
        'konfirmasi-order',
        'mobilku',
        'notification',
        'order',
        'pesanan',
        'thank-you',
        'undang-teman',
        'garasi',
        'otopoints',
        'about-us',
        '404.js',
        '500.js',
        'servis',
        'daftar-alamat',
        'tambah-alamat',
        'explore',
        'promo-product',
        'konsultasi',
        'pickup',
        'pilihan',
        'sitemap-dynamic-search.xml.js',
        'sitemap-promo.xml.js',
        'otoklixpickup',
        'otopickup',
        'gogoklix',
        'cari'
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${staticPagePath}`;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${baseUrl}/about</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${baseUrl}/pilihan/bengkel-pilihan</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
      ${staticPages
        .map((url) => {
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
