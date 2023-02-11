import moment from 'moment';

export const numberOnlyRegex = /^\d*\.?\d*$/;

export const promoSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  infinite: true,
  arrows: false,
  dots: false,
  centerMode: true,
  autoplay: false
};

export const bannerPromoSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  infinite: true,
  arrows: false,
  dots: true,
  centerMode: true,
  autoplay: true,
  autoplaySpeed: 5000,
  // eslint-disable-next-line
  appendDots: (dots) => (
    <div style={{ marginLeft: '-30px', marginTop: '-7px' }}>
      <ul style={{ margin: '0px' }}> {dots} </ul>
    </div>
  )
};

export const alertSettings = {
  className: 'slider variable-width',
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  arrows: false,
  infinite: false,
  centerMode: false,
  variableWidth: true
};

export const trendingSettings = {
  arrows: false,
  dots: false,
  infinite: false,
  centerMode: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  className: 'slider variable-width'
};

export const servicesSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  infinite: false,
  arrows: false,
  dots: true,
  centerMode: true,
  autoplay: false,
  // eslint-disable-next-line
  appendDots: (dots) => (
    <div style={{}}>
      <ul style={{ textAlign: 'center', width: '100%', padding: 0 }}> {dots} </ul>
    </div>
  )
};

export const monasLocation = {
  lat: -6.1753924,
  lng: 106.8271528
};

export const gambirLocation = {
  lat: -6.171483,
  lng: 106.8087547
};

export const gmapConfig = () => {
  const config = {
    disableDefaultUI: true,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  return config;
};

export const mediaBaseFolder =
  'https://static-files-6036.s3-ap-southeast-1.amazonaws.com/website-one-pager';

export const notificationTagList = [
  {
    icon_link: null,
    name: 'Semua',
    slug: 'semua',
    value: 'semua'
  },
  {
    icon_link: null,
    name: 'Transaksi',
    slug: 'transaksi',
    value: 'transaksi'
  },
  {
    icon_link: null,
    name: 'Promo',
    slug: 'promo',
    value: 'promo'
  },
  {
    icon_link: null,
    name: 'Tips & Trick',
    slug: 'tips-and-trick',
    value: 'tips-and-trick'
  }
];

export const OtoPointsDateFilter = [
  {
    name: 'Semua Tanggal Transaksi',
    value: 1
  },
  {
    name: '30 Hari Terakhir',
    value: 2
  },
  {
    name: '90 Hari Terakhir',
    value: 3
  },
  {
    name: 'Pilih Tanggal Sendiri',
    value: 4
  }
];

export const DefaultClosingHour = 18;

export const OtobuddyType = {
  DEFAULT: 'default',
  WORKSHOP: 'workshop',
  GLOBALSEARCH: 'globalsearch'
};

export const globalFilters = [
  {
    name: 'Semua',
    slug: 'all',
    icon: ''
  },
  {
    name: 'Servis',
    slug: 'package',
    icon: '/assets/icons/servis-orange.svg'
  },
  {
    name: 'Bengkel',
    slug: 'workshop',
    icon: '/assets/icons/wrench-orange.svg'
  },
  {
    name: 'Promo',
    slug: 'promo',
    icon: '/assets/icons/promo-orange.svg'
  }
];

export const coachMarkStyles = {
  options: {
    arrowColor: 'transparent'
  }
};

export const coachMarkLocale = {
  back: 'Balik',
  next: 'Lanjutkan',
  last: 'Selesai'
};

export const coachMarkSteps = [
  {
    target: '#coachMarkPromoStep1',
    title: 'Tambah Mobil',
    content:
      'Promo yang akan ditampilkan di halaman ini akan disesuaikan dengan informasi mobil yang kamu berikan.',
    disableBeacon: true
  },
  {
    target: '#coachMarkPromoStep2',
    title: 'Syarat & Ketentuan',
    content: 'Ketahui Syarat & Ketentuan promo ini sebelum kamu melakukan transaksi.',
    disableBeacon: true
  },
  {
    target: '#coachMarkPromoStep3',
    title: 'Pilih Lokasimu',
    content: 'Kami akan menampilkan layanan servis terdekat dari lokasimu.',
    disableBeacon: true
  }
];

export const coachMarkPickupSteps = [
  {
    target: '#coachMarkPickupStep1',
    title: 'Atur Lokasi Kamu di sini',
    content: 'Kamu bisa memasukkan alamatmu secara manual lewat sini ya',
    disableBeacon: true
  }
];

export const coachMarkPickupLocSteps = [
  {
    target: '#coachMarkLocStep1',
    title: 'Pilih Kota/Kecamatan Kamu',
    content: 'Lengkapi alamatmu dengan memasukkan kota/kecamatan kamu di sini ya!',
    disableBeacon: true
  },
  {
    target: '#coachMarkLocStep2',
    title: 'Atur Lokasi secara Otomatis',
    content:
      'Kamu juga bisa mengatur alamatmu secara otomatis dengan klik “Gunakan Lokasi Saat Ini',
    disableBeacon: true
  }
];

export const coachMarkPickupContentSteps = [
  {
    target: '#coachMarkPickupContentStep1',
    title: 'Pilih Kota/Kecamatan Kamu',
    content: 'Lengkapi alamatmu dengan memasukkan kota/kecamatan kamu di sini ya!',
    disableBeacon: true
  },
  {
    target: '#coachMarkPickupContentStep2',
    title: 'Atur Lokasi secara Otomatis',
    content:
      'Kamu juga bisa mengatur alamatmu secara otomatis dengan klik “Gunakan Lokasi Saat Ini',
    disableBeacon: true
  }
];

export const coachMarkVerifiedWsSteps = [
  {
    target: '#coachMarkWsStep1',
    title: 'Bagikan Bengkel',
    content: 'Bagikan link ke halaman bengkel ini dengan tap tombol di sini',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep2',
    title: 'Gallery Foto Bengkel',
    content: 'Tap untuk menampilkan lebih banyak foto untuk bengkel ini',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep3',
    title: 'Lihat Lokasi Bengkel Pada Map',
    content: 'Lihat lokasi bengkel ini lewat applikasi map yang ada pada HP kamu',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep4',
    title: 'Rating & Review',
    content:
      'Bengkel di Otoklix memiliki 2 kriteria penilaian rating keseluruhan bengkel, dan juga harga rata-rata servis yang disediakan bengkel',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep5',
    title: 'Spesialisasi Mobil',
    content:
      'Ketahui spesialisasi mobil manufaktur dari wilayah tertentu yang dapat ditangani oleh bengkel ini.',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep6',
    title: 'Lihat Servis Bengkel',
    content: 'Lihat servis yang dapat ditangani oleh bengkel ini dan mulai booking.',
    disableBeacon: true
  }
];

export const coachMarkNonVerifiedWsSteps = [
  {
    target: '#coachMarkWsStep1',
    title: 'Bagikan Bengkel',
    content: 'Bagikan link ke halaman bengkel ini dengan tap tombol di sini',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep2',
    title: 'Gallery Foto Bengkel',
    content: 'Tap untuk menampilkan lebih banyak foto untuk bengkel ini',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep3',
    title: 'Lihat Lokasi Bengkel Pada Map',
    content: 'Lihat lokasi bengkel ini lewat applikasi map yang ada pada HP kamu',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep4',
    title: 'Klaim Bengkel Ini',
    content:
      'Bengkel di Otoklix memiliki 2 kriteria penilaian rating keseluruhan bengkel, dan juga harga rata-rata servis yang disediakan bengkel',
    disableBeacon: true
  },
  {
    target: '#coachMarkWsStep5',
    title: 'Lihat Servis Bengkel',
    content: 'Lihat servis yang dapat ditangani oleh bengkel ini dan mulai booking.',
    disableBeacon: true
  }
];

export const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const keywords = [
  'oli',
  'ban',
  'cuci',
  'tuneup',
  'tune-up',
  'tune',
  'aki',
  'bodyrepair',
  'body-repair',
  'body',
  'ac',
  'detailing'
];

export const lightBoxSetting = {
  settings: {
    disablePanzoom: true,
    slideAnimationType: 'slide'
  },
  thumbnails: {
    showThumbnails: true
  },
  buttons: {
    showAutoplayButton: false,
    showDownloadButton: false,
    showThumbnailsButton: false
  }
};

export const wsDetailTabMenu = [
  { name: 'Overview', show: true },
  { name: 'Review', show: true },
  { name: 'Spesialisasi', show: true },
  { name: 'Fasilitas', show: true },
  { name: 'Servis', show: false }
];

export const wsDetailTabMenuNonVerified = [
  { name: 'Overview', show: true },
  { name: 'Spesialisasi', show: true },
  { name: 'Fasilitas', show: true },
  { name: 'Servis', show: false }
];

export const defaultLevelPrice = Array.from(Array(5).keys());

export const defaultTagsLoad = Array.from(Array(5).keys());

export const dataSpecializationDesc = [
  {
    name: 'Jepang',
    desc:
      'Bengkel memiliki spesialisasi untuk mobil-mobil manufaktur Jepang, seperti Toyota, Honda, Daihatsu, Suzuki, Mitsubishi, dll.'
  },
  {
    name: 'Eropa',
    desc:
      'Bengkel memiliki spesialisasi untuk mobil-mobil manufaktur Eropa, seperti Mercedes Benz, BMW, Renault, VW, Audi, Volvo, dll.'
  },
  {
    name: 'China',
    desc:
      'Bengkel memiliki spesialisasi untuk mobil-mobil manufaktur China, seperti Wuling, DFSK, dll.'
  },
  {
    name: 'Amerika',
    desc:
      'Bengkel memiliki spesialisasi untuk mobil-mobil manufaktur Amerika, seperti Chevrolet, Ford, dll.'
  },
  {
    name: 'Korea',
    desc:
      'Bengkel memiliki spesialisasi untuk mobil-mobil manufaktur Korea, seperti Hyundai dan Kia. '
  }
];

export const socials = [
  { logo: 'facebook-light', url: 'https://www.facebook.com/otoklix' },
  { logo: 'linkedin', url: 'https://www.linkedin.com/company/otoklix/' },
  { logo: 'youtube', url: 'https://www.youtube.com/channel/UCOp6GgcqNb2dXAZcL59OI3A/featured' },
  { logo: 'instagram', url: 'https://www.instagram.com/otoklix/' }
];

export const productCategory = [
  {
    label: 'Product',
    items: [
      { name: 'Otoklix', url: `/servis` },
      { name: 'OtoPartner', url: 'https://otoklix.com/otopartner' },
      { name: 'OtoXpress', url: '/' },
      { name: 'OtoProduct', url: '/' }
    ]
  },
  {
    label: 'Perusahaan',
    items: [
      { name: 'Blog', url: 'https://otoklix.com/blog/' },
      { name: 'Karir', url: 'https://otoklix.com/career' },
      { name: 'Mitra', url: 'https://otoklix.com/mitra' },
      { name: 'Tentang', url: '/about-us' },
      { name: 'Syarat & Ketentuan', url: '/account/terms-conditions' },
      { name: 'Kebijakan Privasi', url: '/account/privacy-policy' }
    ]
  }
];

export const verifyCodeStep = [
  {
    title: 'Langkah 1',
    desc: 'Datang ke Kasir'
  },
  {
    title: 'Langkah 2',
    desc: 'Tunjukkan kode verifikasi ke kasir agar order segera diproses'
  },
  {
    title: 'Langkah 3',
    desc: 'Mobilmu siap diproses'
  }
];

export const DEFAULT_LOCAL_DATETIME = moment().format('YYYY-MM-DDTHH:mm:ss+07:00');

export const OTOKLIX_GO_LIMIT_BOOKING = 16;
export const OTOKLIX_GO_LIMIT_ORDER = 14;

export const otoPickup = [
  { icon: 'otopickupIcon1', desc: 'Siap Antar-Jemput' },
  { icon: 'otopickupIcon2', desc: 'Pilihan Servis Lengkap' },
  { icon: 'otopickupIcon3', desc: 'Menjangkau Beberapa Area' }
];

export const filterPromo = [
  {
    name: 'Sesuai Mobilmu',
    value: 'recommended-car'
  },
  {
    name: 'Terlaris',
    value: 'best-seller'
  },
  {
    name: 'Harga Terendah',
    value: 'cheapest'
  },
  {
    name: 'Harga Tertinggi',
    value: 'most-expensive'
  }
];

export const filterDynamic = [
  {
    name: 'Paling Sesuai',
    value: 'most-suitable'
  },
  {
    name: 'Harga Terendah',
    value: 'price-low'
  },
  {
    name: 'Harga Tertinggi',
    value: 'price-high'
  }
];

export const OTOKLIX_GO_FLOW = [
  { src: 'pick-up-car', desc: 'Mobil dijemput oleh tim Otoklix.' },
  { src: 'tracking', desc: 'Lokasi mobil dapat dipantau via fitur live tracking.' },
  { src: 'car-service', desc: 'Mobil diservis di bengkel mitra Otoklix.' },
  { src: 'done-service', desc: 'Servis selesai dan mobil akan diantar kembali ke rumah.' }
];

export const listEntrypoints = [
  {
    id: 1,
    name: 'Ganti Oli Mesin',
    slug: 'oli',
    brand: ''
  },
  {
    id: 2,
    name: 'Servis Tune Up',
    slug: 'tune-up',
    brand: ''
  },
  {
    id: 3,
    name: 'Servis Rem',
    slug: 'rem',
    brand: ''
  },
  {
    id: 4,
    name: 'Jasa Cuci',
    slug: 'cuci',
    brand: ''
  },
  {
    id: 5,
    name: 'Pilihan Oli Shell',
    slug: 'oli',
    brand: 'shell'
  },
  {
    id: 6,
    name: 'Pilihan Oli Fuchs',
    slug: 'oli',
    brand: 'fuchs'
  },
  {
    id: 7,
    name: 'Pilihan Oli Pertamina',
    slug: 'oli',
    brand: 'pertamina'
  }
];

export const menuItems = [
  { id: 1, title: 'Garasi', image: 'garasi-active.svg', route: '/garasi' },
  { id: 2, title: 'Bantuan', image: 'question.svg', route: '/account/help' },
  { id: 3, title: 'Kebijakan Privasi', image: 'lock.svg', route: '/account/privacy-policy' },
  {
    id: 4,
    title: 'Syarat & Ketentuan',
    image: 'files-blue.svg',
    route: '/account/terms-conditions'
  },
  { id: 5, title: 'Blog', image: 'article.svg', route: '/blog' },
  { id: 6, title: 'Tentang Kami', image: 'star-blue.svg', route: '/about' }
];

export const listLocation = [
  {
    id: 1,
    name: 'Jakarta Pusat',
    slug: 'jakarta-pusat',
    geoLocation: {
      lat: -6.171483,
      lng: 106.8087547
    }
  },
  {
    id: 2,
    name: 'Jakarta Barat',
    slug: 'jakarta-barat',
    geoLocation: {
      lat: -6.186611,
      lng: 106.746917
    }
  },
  {
    id: 3,
    name: 'Jakarta Selatan',
    slug: 'jakarta-selatan',
    geoLocation: {
      lat: -6.254556,
      lng: 106.79075
    }
  },
  {
    id: 4,
    name: 'Jakara Utara',
    slug: 'jakarta-utara',
    geoLocation: {
      lat: -6.1350731,
      lng: 106.8276764
    }
  },
  {
    id: 5,
    name: 'Jakarta Timur',
    slug: 'jakarta-timur',
    geoLocation: {
      lat: -6.241694,
      lng: 106.896528
    }
  },
  {
    id: 6,
    name: 'Bekasi',
    slug: 'bekasi',
    geoLocation: {
      lat: -6.243724,
      lng: 106.965328
    }
  },
  {
    id: 7,
    name: 'Depok',
    slug: 'depok',
    geoLocation: {
      lat: -6.376361,
      lng: 106.813861
    }
  },
  {
    id: 8,
    name: 'Tangerang',
    slug: 'tangerang',
    geoLocation: {
      lat: -6.3134878,
      lng: 106.7469285
    }
  },
  {
    id: 9,
    name: 'Bogor',
    slug: 'bogor',
    geoLocation: {
      lat: -6.5918611,
      lng: 106.7971111
    }
  }
];

export const tabListServiceCategory = [
  {
    id: 1,
    name: 'Semua',
    slug: 'all'
  },
  {
    id: 2,
    name: 'Oli',
    slug: 'oli'
  },
  {
    id: 3,
    name: 'Ban',
    slug: 'ban'
  },
  {
    id: 4,
    name: 'Cuci',
    slug: 'cuci'
  },
  {
    id: 5,
    name: 'Tune Up',
    slug: 'tune-up'
  },
  {
    id: 6,
    name: 'Aki',
    slug: 'aki'
  },
  {
    id: 8,
    name: 'AC',
    slug: 'ac'
  },
  {
    id: 9,
    name: 'Detailing',
    slug: 'detailing'
  },
  {
    id: 10,
    name: 'Berkala',
    slug: 'berkala'
  },
  {
    id: 11,
    name: 'Eksterior',
    slug: 'eksterior'
  },
  {
    id: 13,
    name: 'Rem',
    slug: 'rem'
  }
];

export const faqsWorkshop = [
  {
    question: 'Mengapa Harus Bengkel Mobil Terdekat dari Lokasi Saya?',
    answer:
      '<p>Membawa mobil ke bengkel yang mudah didatangi dan berjarak dekat dari lokasi kamu tentu saja dapat menghemat energi mobil. Tetapi kamu perlu memilih bengkel mobil terdekat yang berkualitas, ya. Rating dan layanan bengkel ini bisa kamu lihat saat ingin melakukan booking service di aplikasi Otoklix.</p>'
  },
  {
    question: 'Dimana Lokasi Bengkel Terdekat Mitra Otoklix?',
    answer:
      '<p>Bagi kamu yang berada di Jabodetabek, Otoklix memiliki beberapa rekomendasi bengkel untuk kamu. Bengkel-bengkel ini telah memiliki reputasi yang bagus karena kualitas pelayanannya, termasuk beberapa di antaranya adalah bengkel 24 jam terdekat, bengkel mobil matic terdekat, bengkel Honda mobil terdekat, bengkel mobil Daihatsu terdekat, dan bengkel service mobil terdekat.</p><p>Ini dia bengkel mobil terdekat dari sini. Contoh Jakarta, di antaranya adalah Butik Oli Mobil , Otoklix Ciputat, BRS Autoservice, Otoklix Mangga Dua, Berkat Lancar jaya . Kemudian, bengkel di Bogor, di antaranya adalah Bengkel Nawilis Parung</p><p>Selanjutnya, terdapat juga bengkel di Tangerang, contohnya adalah Otoklix Ciputat, Autolux, Varia 2000 dan Banjar Motor. Ada pula bengkel di Depok, di antaranya adalah Tirezone Wiguna Ban, Sinar Alam Motor dan Rafi Motor</p><p>Masih banyak pilihan bengkel umum lainnya di aplikasi Otoklix. Mulai dari bengkel matic terdekat, bengkel untuk mobil manual, dan lain-lain.</p>'
  },
  {
    question: 'Apa Saja Jenis Layanan Bengkel yang Tersedia di Otoklix?',
    answer:
      '<p>Otoklix berupaya menjadi one stop solution for vehicles, jadi segala jenis layanan bengkel dapat kamu temukan di Otoklix. Beberapa layanan di Otoklix adalah ganti oli, ganti dan servis ban mobil, tune-up, ganti aki, bahkan hingga ke layanan cuci mobil. Selain itu, terdapat pula layanan Otoklix Pick Up, yaitu layanan antar-jemput mobil ke bengkel.</p><p>Selain pelayanan di atas, Otoklix juga akan terus meningkatkan jenis layanan agar bisa memenuhi kebutuhan mobil kamu.</p>'
  },
  {
    question: 'Berapa Biaya Bengkel Berdasarkan Layanannya?',
    answer:
      '<p>Biaya perawatan mobil memang tidak murah. Maka dari itu, sebelum memutuskan membeli mobil, sebaiknya kamu memperhitungkan biaya perawatannya juga. Mobil yang jarang diservis akan menurun performa mesinnya dan mungkin menimbulkan kerusakan yang lebih parah pada komponen.</p><p>Ini dia biaya bengkel berdasarkan layanannya. Siapkan anggaran dananya, ya</p><ol><li><p><b>Ganti oli</b></p><p>Ganti oli adalah perawatan mendasar dari sebuah mobil. Ganti oli ini sangat penting karena berhubungan langsung dengan kinerja mesin mobil. Kapasitas oli setiap mobil memang berbeda-beda, tetapi umumnya sekitar 4-5 liter. Jika kamu menggunakan oli dengan harga Rp 100 ribu per liter, maka total biaya ganti oli adalah sekitar Rp 400-500 ribuan. Harga ini belum termasuk biaya jasa service bengkel sekitar Rp 30-50 ribuan. Ganti oli berbeda dengan kuras oli. Pada kuras oli, kamu akan membutuhkan oli yang lebih banyak sekitar 10-12 liter.</p></li><li><p><b>Ganti dan servis ban mobil</b></p><p>Ban perlu diganti paling tidak setiap 3 tahun sekali atau telah mengalami tanda-tanda kerusakan fisik pada ban. Harga ban memang bervariasi tergantung merk dan kualitas. Harga ban dengan kualitas standar sekitar Rp500-600 ribuan. Jadi kalau kamu mau mengganti 4 ban sekaligus, biayanya sekitar Rp2-2,5 jutaan. Untuk biaya jasa bengkel biasanya berkisar Rp100-200 ribuan.Ban mobil juga perlu dilakukan spooring dan balancing agar tetap seimbang dan stabil. Biaya untuk balancing adalah Rp50 ribu per ban dan biaya untuk spooring adalah Rp150-300 ribu tergantung jenis mobil.</p></li><li><p><b>General Check-Up</b></p><p>Mobil juga perlu dilakukan pemeriksaan keseluruhan, seperti tubuh manusia. Fungsinya adalah untuk mendeteksi dini kerusakan komponen mobil. Pemeriksaan ini tidak perlu membongkar mesin atau mengganti spare part. Kamu disarankan untuk melakukan general check-up setiap 10.000 km. Biaya untuk general check-up di bengkel umum ini sekitar Rp500 ribu.</p></li><li><p><b>Servis berkala</b></p><p>Kamu tentu sudah familier dengan istilah ini. Service berkala ini kurang lebih sama dengan general check-up, hanya saja ada penggantian spare part jika dibutuhkan di tiap jarak tempuh tertentu atau jangka waktu tertentu. Salah satu yang diganti adalah pelumas-pelumas mobil, filter oli dan filter udara, dan minyak rem. Ada beberapa servis berkala yang wajib kamu lakukan, yaitu pada 1.000 km pertama untuk mobil baru, kelipatan 5.000 km, 10.000 km, 20.000 km, 40.000 km, dan 80.000 km. Setiap jarak tempuh memiliki komponen tertentu yang harus dicek. Biaya servis berkala ini juga berbeda sesuai jarak tempuh dan spare part yang harus diganti, berkisar Rp500-2 jutaan.</p></li><li><p><b>Biaya tune up</b></p><p>Banyak yang mengartikan tune up sama dengan service berkala. Tetapi ternyata ada perbedaan, tune up menyetel ulang komponen mobil. Tune up dilakukan paling tidak setiap enam bulan atau satu tahun sekali. Biaya tune up mobil sekitar Rp 700 ribu sampai dengan Rp2 juta. Harga ini memang cukup mahal, tetapi sebanding dengan kenyamanan yang diberikan.</p></li><li><p><b>Ganti aki</b></p><p>Aki adalah komponen penting dalam kelistrikan mobil. Tanpa aki, mobil tidak akan bisa distarter. Kamu bisa mendapatkan aki mobil dengan harga mulai dari Rp600 ribu sampai dengan Rp900 ribuan. Biaya jasa untuk ganti aki saja hanya Rp50 ribuan.</p></li><li><p><b>Biaya cuci mobil</b></p><p>Biaya cuci mobil juga bervariasi tergantung paket yang diambil dan juga teknik cuci mobil yang digunakan. Pelayanan standar cuci mobil manual sekitar Rp 35-50 ribuan. Sementara untuk cuci mobil robotic sekitar Rp 80-150 ribuan.</p></li><li><p><b>Servis AC mobil</b></p><p>Tak dipungkiri bahwa AC mobil adalah komponen penting, apalagi di negara tropis seperti Indonesia. Tidak hanya mengisi freon, servis AC juga meliputi pengecekan kompresor AC, kondensor, expansi valve, dan lain-lain. Biaya servis AC ini berbeda-beda tergantung jenis perawatannya, berkisar Rp 300 ribu hingga Rp 1,5 juta.</p></li></li></ol>'
  },
  {
    question: 'Apa Kriteria dan Tips Memilih Bengkel Mobil Terbaik?',
    answer:
      '<p>Ada beberapa hal yang perlu kamu perhatikan saat memilih bengkel mobil terbaik. Tentu saja agar hasil yang kamu dapatkan memuaskan. Ini adalah 6 tips memilih bengkel mobil terbaik.</p><ol><li><p><b>Lokasi bengkel strategis</b></p><p>Bengkel yang akan kamu datangi sebaiknya berada di lokasi yang mudah dijangkau, misalnya di jalan besar atau di sekitar jalan raya utama. Selain itu kawasan sekitar bengkel juga menjadi poin tambahan. Jika di sekitarnya ada mal atau cafe, kamu bisa menunggu dengan lebih nyaman apabila perawatan bengkel membutuhkan waktu yang cukup lama.</p></li><li><p><b>Memiliki alat yang lengkap</b></p><p>Bengkel yang memiliki alat yang lengkap akan mempermudah dan mempercepat pengerjaan teknisi. Selain itu, alat yang lengkap juga meminimalisasi kerusakan komponen akibat penggunaan alat yang tidak sesuai. Bahkan ada beberapa alat khusus yang dirancang untuk jenis atau tipe mobil tertentu. Selain lengkap, bengkel juga perlu meng-upgrade peralatan perbengkelan mereka agar sesuai dengan mobil keluaran terbaru.</p></li><li><p><b>Layanan servis lengkap</b></p><p>Bengkel tepercaya akan memiliki berbagai pelayanan servis yang lengkap agar kamu tidak perlu pergi ke bengkel lain jika ditemukan masalah lain pada mobil.</p></li><li><p><b>Memiliki cabang di beberapa tempat</b></p><p>Poin ini menjadi nilai tambah untuk kamu yang ingin memilih bengkel. Cabang di beberapa tempat atau di beberapa kota menunjukkan bahwa bengkel itu sudah menjadi pilihan banyak pengguna kendaraan. Tetapi hal ini tidak mutlak.</p></li><li><p><b>Biaya bengkel terjangkau</b></p><p>Bengkel terbaik tidak akan mematok harga terlalu tinggi atau terlalu rendah. Biaya perbaikan ini harus masuk akal sesuai dengan standar bengkel kebanyakan. Biasanya beberapa masalah mobil membutuhkan penggantian suku cadang. Kamu juga bisa menjadikan harga suku cadang ini sebagai acuan. Jika harga suku cadang yang digunakan cenderung murah tetapi total biaya perbaikan menjadi sangat mahal, berarti bengkel tersebut mematok harga jasa yang tinggi.</p></li><li><p><b>Layanan berkualitas dan bergaransi</b></p><p>Bengkel yang berkualitas sebaiknya memiliki pelayanan yang baik, bahkan sejak sambutan pertama kali kamu datang ke bengkel. Pihak bengkel atau montir bisa diajak berdiskusi agar kamu lebih nyaman menanyakan solusi apabila ada kerusakan pada mobil. Selain itu, jika memungkinkan, carilah bengkel yang memiliki garansi.</p></li></ol>'
  },
  {
    question: 'Mengapa Harus Pakai Otoklix saat Mencari Bengkel Terdekat?',
    answer:
      '<p>Kamu bisa mencari pelayanan apa saja di aplikasi Otoklix. Selain itu, ini dia alasan mengapa kamu harus mencari bengkel terdekat melalui Otoklix.</p><ul><li><p><b>Banyak pilihan bengkel terdekat: </b>Kamu bisa mencari bengkel mobil terdekat dari lokasi saya sekarang menggunakan daftar bengkel terdekat mobil yang tertera di website dan aplikasi Otoklix. Cara kerja Otoklix adalah saat kamu mencari bengkel, akan tertera perkiraan jarak dari lokasimu ke bengkel tersebut.</p></li><li><p><b>Informasi fasilitas bengkel: </b>Selain informasi lokasi, kamu juga bisa mendapatkan informasi fasilitas bengkel seperti fasilitas toilet, AC, dan charging booth.</p></li><li><p><b>Jenis layanan lengkap: </b>Dari ganti oli, ganti aki, servis ban, sampai dengan cuci mobil bisa kamu temukan di aplikasi Otoklix. Kamu akan diarahkan ke bengkel terdekat yang menyediakan layanan tersebut.</p></li><li><p><b>Harga transparan: </b>Jika kamu khawatir biaya servis yang membengkak, maka tidak perlu lagi khawatir ketika melakukan booking service di aplikasi Otoklix. Harga yang perlu kamu bayarkan sesuai dengan yang tertera di aplikasi.</p></li><li><p><b>Harga terjangkau: </b>Harga servis di Otoklix hingga 40% lebih murah daripada di bengkel resmi. Selain itu ada pula program OtoPoints berupa reward saat kamu melakukan perawatan. OtoPoints ini dapat ditukarkan kembali pada service berikutnya. Kamu juga bisa mendapatkan promo menarik yang menjadi program rutin Otoklix.</p></li><li><p><b>Bisa jadwalkan servis: </b>Kamu bisa memilih jadwal untuk servis ke bengkel. Setelah itu kamu bisa langsung mendatangi bengkel dan membayar sesuai harga di aplikasi.</p></li><li><p><b>Garansi 14 hari: </b>Tak perlu khawatir jika setelah keluar dari bengkel mobil kamu kembali mengalami kerusakan yang sama. Kamu bisa mendapatkan garansi servis 14 hari terhitung sejak pengerjaan di bengkel.</p></li><li><p><b>Cek bengkel mobil terdekat yang masih buka: </b>Kamu bisa mengecek bengkel mobil terdekat yang masih buka di aplikasi dan website Otoklix.com.</p></li><li><p><b>Layanan bengkel panggilan: </b>Otoklix juga menyediakan bengkel mobil panggilan terdekat dari lokasi saya melalui layanan OtoPickUp. Layanan ini memungkinkan kamu mendapatkan bengkel mobil panggilan terdekat untuk servis tertentu.</p></li></ul>'
  }
];

export const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
