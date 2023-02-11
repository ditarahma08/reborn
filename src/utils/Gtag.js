import find from 'lodash/find';
import TagManager from 'react-gtm-module';

const gtagManager = ({ action, category, label, value }) => {
  TagManager.dataLayer({
    dataLayer: {
      event: value,
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    }
  });
};

const gtagEvents = (action, value, label) => {
  const gtagEventsData = [
    { action: 'view home page', category: 'home page', label: label, value: 'viewHomePage' },
    { action: 'click search', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click promo', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click category icon', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click navbar icon', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'view ws', category: 'search ws map', label: label, value: 'viewSearchWs' },
    { action: 'view sku', category: 'ws detail page', label: label, value: 'viewWsDetailPage' },
    {
      action: 'view order and booking detail',
      category: 'confirm order page',
      label: label,
      value: 'viewConfirmOrderPage'
    },
    {
      action: 'view thank you page',
      category: 'thank you page',
      label: label,
      value: 'viewThankYouPage'
    },
    { action: 'click sku', category: 'ws detail page', label: label, value: 'clickWsDetailPage' },
    {
      action: 'view sku detail',
      category: 'ws detail page',
      label: label,
      value: 'viewWsDetailPage'
    },
    {
      action: 'click sku detail option',
      category: 'ws detail page',
      label: label,
      value: 'clickWsDetailPage'
    },
    {
      action: 'click add to cart',
      category: 'ws detail page',
      label: label,
      value: 'clickWsDetailPage'
    },
    {
      action: 'click pesan servis kapan',
      category: 'confirm order page',
      label: label,
      value: 'clickConfirmOrderPage'
    },
    {
      action: 'click jadwal booking',
      category: 'confirm order page',
      label: label,
      value: 'clickConfirmOrderPage'
    },
    {
      action: 'click jadwal booking',
      category: 'confirm order page',
      label: label,
      value: 'clickConfirmOrderPage'
    },
    {
      action: 'click checkout',
      category: 'confirm order page',
      label: label,
      value: 'clickConfirmOrderPage'
    },
    {
      action: 'click tambah mobil',
      category: 'ws detail page',
      label: label,
      value: 'clickWsDetailPage'
    },
    {
      action: 'click cari mobil',
      category: 'tambah mobil order page',
      label: label,
      value: 'clickTambahMobilOrderPage'
    },
    {
      action: 'click nomor polisi',
      category: 'tambah mobil order page',
      label: label,
      value: 'clickTambahMobilOrderPage'
    },
    {
      action: 'click transmisi',
      category: 'tambah mobil order page',
      label: label,
      value: 'clickTambahMobilOrderPage'
    },
    {
      action: 'click tahun',
      category: 'tambah mobil order page',
      label: label,
      value: 'clickTambahMobilOrderPage'
    },
    {
      action: 'click tambah mobil',
      category: 'tambah mobil order page',
      label: label,
      value: 'clickTambahMobilOrderPage'
    },
    {
      action: 'view login page',
      category: 'login order page',
      label: label,
      value: 'viewLoginOrderPage'
    },
    {
      action: 'click masukan nomor hp',
      category: 'login order page',
      label: label,
      value: 'clickLoginOrderPage'
    },
    {
      action: 'click kirim',
      category: 'login order page',
      label: label,
      value: 'viewLoginOrderPage'
    },
    {
      action: 'view otp page',
      category: 'otp order page',
      label: label,
      value: 'viewOtpOrderPage'
    },
    {
      action: 'click otp field',
      category: 'otp order page',
      label: label,
      value: 'clickOtpOrderPage'
    },
    {
      action: 'click submit otp',
      category: 'login order page',
      label: label,
      value: 'clickOtpOrderPage'
    },
    {
      action: 'view ketersediaan service',
      category: 'ws detail page',
      label: label,
      value: 'viewWsDetailPage'
    },
    { action: 'click otopoints', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click notifcenter', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click all promo', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click sku', category: 'home page', label: label, value: 'clickHomePage' },
    { action: 'click all sku', category: 'home page', label: label, value: 'clickHomePage' },
    {
      action: 'view notifcenter',
      category: 'notification center',
      label: label,
      value: 'viewNotificationCenter'
    },
    {
      action: 'click filter',
      category: 'notification center',
      label: label,
      value: 'clickNotificationCenter'
    },
    {
      action: 'click notifcenter content',
      category: 'notification center',
      label: label,
      value: 'clickNotificationCenter'
    },
    { action: 'view promo list', category: 'promo list', label: label, value: 'viewPromoList' },
    { action: 'click promo', category: 'promo list', label: label, value: 'clickPromoList' },
    {
      action: 'view promo detail',
      category: 'promo detail',
      label: label,
      value: 'viewPromoDetail'
    },
    {
      action: 'click use promo',
      category: 'promo detail',
      label: label,
      value: 'clickPromoDetail'
    },
    { action: 'view account', category: 'account', label: label, value: 'viewAccount' },
    { action: 'click referral', category: 'account', label: label, value: 'clickAccount' },
    { action: 'view referral', category: 'referral', label: label, value: 'viewReferral' },
    { action: 'click share referral', category: 'referral', label: label, value: 'clickReferral' },
    {
      action: 'view explore maps',
      category: 'explore maps',
      label: label,
      value: 'viewExploreMaps'
    },
    { action: 'click maps', category: 'explore maps', label: label, value: 'clickExploreMaps' },
    { action: 'click search', category: 'explore maps', label: label, value: 'clickExploreMaps' },
    { action: 'click filter', category: 'explore maps', label: label, value: 'clickExploreMaps' },
    { action: 'click workshop', category: 'explore maps', label: label, value: 'clickExploreMaps' },

    {
      action: 'view filter',
      category: 'explore maps filter',
      label: label,
      value: 'viewExploreMapsFilter'
    },
    {
      action: 'click filter price',
      category: 'explore maps filter',
      label: label,
      value: 'clickExploreMapsFilter'
    },
    {
      action: 'click filter workshop',
      category: 'explore maps filter',
      label: label,
      value: 'clickExploreMapsFilter'
    },
    {
      action: 'click save',
      category: 'explore maps filter',
      label: label,
      value: 'clickExploreMapsFilter'
    },
    {
      action: 'click tanya cs home',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyHome'
    },
    {
      action: 'click konsultasi otoexpert home',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyHome'
    },
    {
      action: 'click tanya cs workshop',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyWorkshop'
    },
    {
      action: 'click konsultasi otoexpert workshop',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyWorkshop'
    },
    {
      action: 'open otobuddy home',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyHome'
    },
    {
      action: 'open otobuddy workshop',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyWorkshop'
    },
    { action: 'view search', category: 'search page', label: label, value: 'viewSearchPage' },
    {
      action: 'click input search',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    { action: 'click filter', category: 'search page', label: label, value: 'clickSearchPage' },
    {
      action: 'click cari di sekitar',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    {
      action: 'click untuk mobil',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    {
      action: 'click otobuddy icon',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    { action: 'click workshop', category: 'search page', label: label, value: 'clickSearchPage' },
    {
      action: 'click lebih banyak workshop',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    { action: 'click sku', category: 'search page', label: label, value: 'clickSearchPage' },
    {
      action: 'click lebih banyak sku',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    { action: 'click promo', category: 'search page', label: label, value: 'clickSearchPage' },
    {
      action: 'click lebih banyak promo',
      category: 'search page',
      label: label,
      value: 'clickSearchPage'
    },
    {
      action: 'open otobuddy highlight',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyHighlight'
    },
    {
      action: 'close otobuddy highlight',
      category: 'otobuddy icon',
      label: label,
      value: 'clickOtoBuddyHighlight'
    },

    {
      action: 'view register login page',
      category: 'register login page',
      label: label,
      value: 'viewLoginPage'
    },
    {
      action: 'click kirim nomor button',
      category: 'register login page',
      label: label,
      value: 'clickLoginPage'
    },
    {
      action: 'click lanjutkan google',
      category: 'register login page',
      label: label,
      value: 'clickLoginPage'
    },
    {
      action: 'view lengkapi data page',
      category: 'lengkapi data page',
      label: label,
      value: 'viewOtpPage'
    },
    {
      action: 'click kirim',
      category: 'lengkapi data page',
      label: label,
      value: 'clickOtpPage'
    },
    {
      action: 'view otp page',
      category: 'otp page',
      label: label,
      value: 'viewOtpPage'
    },
    { action: 'click lanjutkan', category: 'otp page', label: label, value: 'clickOtpPage' }
  ];

  return find(gtagEventsData, { action: action, value: value });
};

export const gtag = (action, value, label = '') => {
  gtagManager(gtagEvents(action, value, label));
};
