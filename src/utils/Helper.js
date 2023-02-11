import { isNull } from 'lodash';
import map from 'lodash/map';
import moment from 'moment';

export default class Helper {
  static getValueFromKey(data, key) {
    return map(data, key).join(', ');
  }

  static formatMoney(amount, decimalCount = 0, decimal = ',', thousands = '.') {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 0 : decimalCount;

      const negativeSign = amount < 0 ? '-' : '';

      let i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();

      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : '')
      );
    } catch (e) {
      console.log(e);
    }
  }

  static hidePrice(amount) {
    // convert using formatMoney first
    // input must be string
    return amount.substr(0, 1) + amount.substr(1).replace(/\d/g, 'x');
  }

  static formatPercentage(decimal) {
    if (decimal) {
      return `${Math.floor(decimal * 100)}%`;
    }
    return ``;
  }

  static getServiceInit(service, services, key = 'value') {
    const isExist = services.some((item) => item[key] == service);
    if (isExist == false) {
      if (services.length > 0) {
        return services[0].slug;
      } else {
        return 'all';
      }
    } else {
      return service;
    }
  }

  static onlyAlphabetUpperCase(value) {
    return value.replace(/[^A-Za-z]/gi, '').toUpperCase();
  }

  static transmissionConverter(type, defaultValue) {
    switch (type) {
      case 'mt':
        return 'Manual';
      case 'at':
        return 'Automatic';
      default:
        return defaultValue ? defaultValue : '-';
    }
  }

  static fuelConverter(type, defaultValue) {
    switch (type) {
      case 'P':
        return 'Bensin';
      case 'D':
        return 'Diesel';
      default:
        return defaultValue ? defaultValue : '-';
    }
  }

  static getSinglePrice(priceString) {
    let priceArray = priceString.split('-');
    if (priceArray.length > 1) {
      return this.formatMoney(priceArray[1], 0, ',', '.');
    } else {
      return this.formatMoney(priceArray[0], 0, ',', '.');
    }
  }

  static OtopointsCalc(money) {
    return money * 0.01;
  }

  static dateCorrection(date) {
    if (!moment(date)._isValid) {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    } else {
      return date;
    }
  }

  static isEmptyObj(obj) {
    return Object.entries(obj).length === 0;
  }

  static isNotEmptyArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  static currentFormatSimple(options) {
    let number = Math.abs(Number(options.number));

    // Nine zeros for Billions
    if (Number(number) >= 1.0e9) {
      return (number / 1.0e9).toFixed(options.billion.decimal) + ` ${options.billion.unit}`;
    }

    // Six zeros for Millions
    if (Number(number) >= 1.0e6) {
      return (number / 1.0e6).toFixed(options.million.decimal) + ` ${options.million.unit}`;
    }

    // Thrhee zeros for Thousands
    if (Number(number) >= 1.0e3) {
      return (number / 1.0e3).toFixed(options.thousand.decimal) + ` ${options.thousand.unit}`;
    }

    return number;
  }

  static toRupiahRange(val) {
    /* 
        val can be null or undefined
        val can be number, e.g 0, 40000
        val can be text, e.g "0", "35000", "600000-700000"
        val can be empty string, e.g ""
    */
    if (val == null || val == 0 || val == '0' || val == '') {
      return '';
    }
    const splittedString = val.toString().replace(/,/g, '').split('-');
    const fromPriceString = splittedString[0];
    const toPriceString = splittedString[1];
    let formattedFromPrice;
    let formattedToPrice;
    if (fromPriceString) {
      const fromPrice = Number(fromPriceString);
      formattedFromPrice = this.currentFormatSimple({
        number: fromPrice,
        billion: {
          decimal: 0,
          unit: 'B'
        },
        million: {
          decimal: 0,
          unit: 'Juta'
        },
        thousand: {
          decimal: 0,
          unit: 'Ribu'
        }
      });
    }
    if (toPriceString) {
      const toPrice = Number(toPriceString);
      formattedToPrice = this.currentFormatSimple({
        number: toPrice,
        billion: {
          decimal: 0,
          unit: 'B'
        },
        million: {
          decimal: 0,
          unit: 'Juta'
        },
        thousand: {
          decimal: 0,
          unit: 'Ribu'
        }
      });
    }
    if (typeof formattedToPrice === 'undefined') {
      return `Rp${formattedFromPrice}`;
    }
    if (formattedFromPrice === formattedToPrice) {
      return `Rp${formattedFromPrice}`;
    }
    const final = `Rp${formattedFromPrice} - Rp${formattedToPrice}`;
    return final;
  }

  static maxCount99(count) {
    return count > 99 ? '99+' : count;
  }

  static maxCount9(count) {
    return count > 9 ? '9+' : count;
  }

  static notificationBadgeColor(slug) {
    switch (slug) {
      case 'transaksi':
        return 'secondary';
      case 'promo':
        return 'success';
      case 'event':
        return 'primary';
      default:
        break;
    }
  }

  static formatLicensePlate(licensePlate) {
    if (licensePlate?.indexOf(' ') == -1) {
      try {
        const plateNumbers = licensePlate.match(/([0-9])+/g)[0];
        return licensePlate.replace(plateNumbers, ` ${plateNumbers} `);
      } catch (error) {
        return licensePlate;
      }
    } else {
      return licensePlate;
    }
  }

  static calcDiscountOff(numerator, denominator) {
    if (denominator) {
      const offValue = (denominator - numerator) / denominator;
      return `${Math.ceil(offValue * 100)}%`;
    }
    return ``;
  }

  static shortenName(originalText) {
    if (originalText == null || typeof originalText === 'undefined') return '-';
    originalText = originalText.split(' - ')[0];
    return originalText;
  }

  static getMaxWorkingHour() {
    return moment().hour() > 18 ? moment().set('hour', 9) : moment();
  }

  static exploreMetaTags(category) {
    switch (category) {
      case 'oli':
        return {
          title: 'Bengkel Oli Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel oli mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'cuci':
        return {
          title: 'Cuci Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan cuci mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'ban':
        return {
          title: 'Bengkel Ban Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel ban mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'tune-up':
        return {
          title: 'Tuneup Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel tune up mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔oli ✔ban dll.'
        };
      case 'bengkel':
        return {
          title: 'Bengkel Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'aki':
        return {
          title: 'Bengkel Aki Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel aki mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'body-repair':
        return {
          title: 'Body Repair Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel body repair mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔oli ✔ban dll.'
        };
      case 'ac':
        return {
          title: 'Bengkel AC Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel AC mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      case 'detailing':
        return {
          title: 'Detailing Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel detailing mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔oli ✔ban dll.'
        };
      case 'servis':
        return {
          title: 'Otoklix: Aplikasi Booking Bengkel & Servis Mobil',
          desc:
            'Booking servis mobil untuk servis berkala, ganti oli, ban, spooring balancing ✔2.000+ bengkel terdekat ✔harga transparan via aplikasi Otoklix.'
        };
      case 'promo':
        return {
          title: 'Servis Mobil Pakai Harga Promo Termurah - Otoklix',
          desc:
            'Dapatkan promo servis mobil untuk servis berkala, ganti oli, ban, spooring balancing ✔2.000+ bengkel terdekat ✔harga transparan via aplikasi Otoklix.'
        };
      case 'workshop':
        return {
          title: 'Bengkel Mobil Terdekat & Terbaik dari Lokasi Kamu - Otoklix',
          desc:
            'Temukan bengkel mobil terdekat dari lokasi saya 🚙 hanya di website aplikasi bengkel online Otoklix.com! Tersedia ✔servis mobil ✔ganti oli ✔ban dll.'
        };
      default:
        return;
    }
  }

  static lowerCase(text) {
    return text.toString().toUpperCase();
  }

  static setSeoCity(city) {
    const getCity = city !== undefined ? city : 'Kab. ';
    let check = getCity.includes('Kab.');
    if (check) {
      return getCity.replace('Kab. ', '');
    } else {
      return getCity.replace('Kota ', '');
    }
  }

  static metaWorkshop(data) {
    const category = data?.service_categories;
    const categorySlug = category[0]?.slug;
    if (category.length > 1) {
      if (category.length === 2) {
        if (categorySlug === 'cuci' || categorySlug === 'detailing') {
          // Khusus category cuci dan detailing
          return {
            title: `${data?.name} - ${category[0]?.name} & ${
              category[1]?.name
            } Mobil ${this.setSeoCity(data?.city)}`,
            desc: `${data?.name} ${category[0]?.name} dan ${
              category[1]?.name
            } Mobil terdekat ${this.setSeoCity(data?.city)} dengan harga transparan via Otoklix`
          };
        } else {
          // 2 kategori untuk general bengkel
          return {
            title: `${data?.name} - Bengkel Mobil ${this.setSeoCity(data?.city)}`,
            desc: `${data?.name} bengkel mobil terdekat ${this.setSeoCity(
              data?.city
            )} untuk servis ${category[0]?.name}, ${
              category[1]?.name
            } dan lainnya dengan harga transparan via Otoklix`
          };
        }
      } else {
        // Bengkel lebih dari 2 atau general bengkel
        return {
          title: `${data?.name} - Bengkel Mobil ${this.setSeoCity(data?.city)}`,
          desc: `${data?.name} bengkel mobil terdekat ${this.setSeoCity(data?.city)} untuk servis ${
            category[0]?.name
          }, ${category[1]?.name}, ${category[2]?.name}, ${
            category[3]?.name
          } dan lainnya dengan harga transparan via Otoklix`
        };
      }
    } else {
      const categoryName = category[0]?.name;
      switch (categorySlug) {
        case 'cuci':
          return {
            title: `${data?.name} - ${categoryName} Mobil ${this.setSeoCity(data?.city)}`,
            desc: `${data?.name}  ${categoryName} Mobil terdekat ${this.setSeoCity(
              data?.city
            )} dengan harga transparan via Otoklix`
          };
        case 'detailing':
          return {
            title: `${data?.name} - ${categoryName} Mobil ${this.setSeoCity(data?.city)}`,
            desc: `${data?.name}  ${categoryName} Mobil terdekat ${this.setSeoCity(
              data?.city
            )} dengan harga transparan via Otoklix`
          };
        default:
          return {
            title: `${data?.name} - Bengkel Mobil ${this.setSeoCity(data?.city)}`,
            desc: `${data?.name} bengkel mobil terdekat ${this.setSeoCity(
              data?.city
            )} untuk servis ${categoryName} dan lainnya dengan harga transparan via Otoklix`
          };
      }
    }
  }

  static truncateText(input, number = 70) {
    return input?.length > number ? `${input?.substring(0, number)}...` : input;
  }

  static formatAnonymous(name) {
    const arrayName = name.split(' ');
    const maskedName = arrayName.map((string) => {
      return string[0] + new Array(string.length).join('*');
    });

    return maskedName.join(' ');
  }

  static formatNumberCount(number) {
    const stringNumber = number.toString();
    if (stringNumber.length <= 3) {
      return stringNumber;
    } else if (stringNumber.length > 3 && stringNumber.length < 7) {
      const reducedThree = stringNumber.slice(0, -3);
      const reducedTwo = stringNumber.slice(0, -2);

      if (reducedThree.length === 1) {
        return reducedTwo.charAt(1) != 0
          ? `${reducedTwo.charAt(0)},${reducedTwo.charAt(1)}rb`
          : `${reducedThree}rb`;
      } else {
        return `${reducedThree}rb`;
      }
    } else {
      const reducedSix = stringNumber.slice(0, -6);
      const reducedFive = stringNumber.slice(0, -5);

      if (reducedSix.length === 1) {
        return reducedFive.charAt(1) != 0
          ? `${reducedFive.charAt(0)},${reducedFive.charAt(1)}jt`
          : `${reducedSix}jt`;
      } else {
        return `${reducedSix}jt`;
      }
    }
  }

  static minuteToHour(minutes) {
    const seconds = minutes % 60;
    return `${Math.floor(minutes / 60)}${seconds !== 0 ? seconds : ''}`;
  }

  static generateWorkshopLabel(tier) {
    const tierName = tier?.toLowerCase();
    if (tierName?.includes('workshop')) {
      return tier?.slice(0, -9);
    } else {
      return tier;
    }
  }

  static maskPrice(price) {
    const REGEX_NUMBER = /[0-9]/g;
    const formattedPrice = this.formatMoney(price);
    const firstChar = formattedPrice.slice(0, 1);
    const restChar = formattedPrice.substring(1);

    return `${firstChar}${restChar.replace(REGEX_NUMBER, 'x')}`;
  }

  static removeDoubleSpace(words) {
    return words ? words.replace(/\s+/g, ' ').trim() : words;
  }

  static exploreOrderButtonList(status, id) {
    let buttonList;

    if (status === 'waiting') {
      //menunggu dikonfirmasi
      buttonList = [
        { name: 'Hubungi Otobuddy', url: '/' },
        { name: 'Ubah Jadwal', url: `/ubah-jadwal/${id}` },
        { name: 'Batal', url: `/batal-pesan?booking_code=${id}` }
      ];
    } else if (status === 'payment') {
      //menunggu pembayaran
      buttonList = [
        { name: 'Hubungi Otobuddy', url: '/' },
        { name: 'Lihat Detail Order', url: `/order/${id}` },
        { name: 'Batal', url: `/batal-pesan?booking_code=${id}` }
      ];
    } else if (status === 'confirm') {
      //order dikonfirmasi
      buttonList = [
        { name: 'Hubungi Otobuddy', url: '/' },
        { name: 'Lihat Detail Order', url: `/order/${id}` },
        { name: 'Ubah Jadwal', url: `/ubah-jadwal/${id}` }
      ];
    } else if (status === 'on-process') {
      //mobil diproses
      buttonList = [{ name: 'Hubungi Otobuddy', url: '/' }];
    } else if (status === 'cancel') {
      //order dicbatalkan
      buttonList = [
        { name: 'Hubungi Otobuddy', url: '/' },
        { name: 'Lihat Detail Batal', url: `/batal-pesan/${id}` }
      ];
    } else {
      // selesai, komplain, order batal, butuh konfirmasi
      buttonList = [
        { name: 'Hubungi Otobuddy', url: '/' },
        { name: 'Lihat Detail Order', url: `/order/${id}` }
      ];
    }

    return buttonList;
  }

  static exploreOrderButton(status, id) {
    switch (status) {
      case 'waiting':
        return {
          name: 'Lihat Detail',
          url: `/order/${id}`
        };
      case 'payment':
        return {
          name: 'Bayar Sekarang',
          url: `to_payment`
        };
      case 'confirm':
        return {
          name: 'Tampilkan Kode Verifikasi',
          url: `/verifikasi/${id}`
        };
      case 'on-process':
        return {
          name: 'Lihat Detail',
          url: `/order/${id}`
        };
      case 'service-done':
        return {
          name: 'Konfirmasi Selesai',
          url: `/detail/${id}`
        };
      case 'finish':
        return {
          name: 'Order Lagi',
          url: `/konfirmasi-order`
        };
      case 'komplain':
        return {
          name: 'Rincian Komplain',
          url: `/`
        };
      case 'cancel':
        return {
          name: 'Order Lagi',
          url: `/konfirmasi-order`
        };
      default:
        return;
    }
  }

  static infoPaymentOrder(status, extra) {
    switch (status) {
      case 'waiting':
        return 'Bengkel akan segera mengkonfirmasi ordermu';
      case 'payment':
        return `Bayar melalui ${extra || ''} sebelum`;
      case 'confirm':
        return 'Yey! Order sudah dikonfirmasi oleh bengkel';
      case 'on-process':
        return 'Mobilmu sedang diproses. Silakan menunggu';
      case 'service-done':
        return 'Servis selesai. Beri konfirmasimu untuk order ini';
      case 'complain':
        return `Komplain: ${extra} telah diajukan`;
      case 'cancel':
        return 'Ordermu dibatalkan';
      default:
        return;
    }
  }

  static decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  static slugToTitle(slug) {
    const words = slug.split('-');

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
  }

  static shortText(text, val) {
    if (text?.length > +val) {
      return text.substring(0, +val) + '...';
    } else {
      return text;
    }
  }

  static moveArrayItemToNewIndex(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  static getTagsFromServices(tags) {
    if (tags?.length > 0) {
      return tags.map((item) => item.name);
    } else {
      return [];
    }
  }

  static removePhonePrefix(phone) {
    if (phone?.charAt(0) === '+') {
      return phone.replace('+62', '');
    } else if (phone?.charAt(0) === '0') {
      return phone.replace('0', '');
    } else if (phone?.charAt(0) === '6') {
      return phone.replace('62', 0);
    }
  }

  static fixPhoneNumber(phone) {
    if (phone[0] !== '8' && phone[1] === '8') {
      return phone.replace(phone[0], '');
    } else if (phone[0] !== '8' && phone[1] !== '8') {
      return phone.replace(phone[0], '8');
    }
    return phone;
  }

  static labelRecommend(recommend) {
    if (recommend) {
      return 'Sesuai Mobilmu';
    } else {
      return '';
    }
  }

  static openOtobuddy() {
    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      if (chatId) {
        window.fcWidget.open();
      }
    }
  }

  static async fetcher(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  }

  static mappingTabBrand(item, index, category) {
    return {
      id: index,
      name: item?.title,
      path: `/servis/${category}/${item?.tag ?? ''}`,
      isActive: item?.selected
    };
  }

  static objectToQueryString(obj) {
    return Object.keys(obj)
      .map((key) => key + '=' + obj[key])
      .join('&');
  }

  static shortHtmlContent(content) {
    if (!isNull(content)) {
      const plainString = content.replace(/<[^>]+>|(&nbsp;)/g, '');
      const contentShort = `${plainString.substr(0, 150)} . . .`;
      return contentShort;
    } else {
      return '';
    }
  }

  static getNameSorted(slug) {
    switch (slug) {
      case 'price-low':
        return 'Harga Terendah';
      case 'price-high':
        return 'Harga Tertinggi';
      case 'most-suitable':
        return 'Paling Sesuai';
      default:
        return slug;
    }
  }

  static stringToSlug(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static checkCompatibility(categoryService) {
    switch (categoryService) {
      case 'oli':
        return true;
      case 'tune-up':
        return true;
      default:
        return false;
    }
  }

  static updateLocation(location) {
    sessionStorage.setItem('loc', JSON.stringify(location));
  }

  static getLocation() {
    const location = sessionStorage.getItem('loc');
    return JSON.parse(location);
  }

  static getGender(gender) {
    if (gender) {
      switch (gender.toLowerCase()) {
        case 'pria':
          return 'male';
        case 'wanita':
          return 'female';
        default:
          return 'other';
      }
    } else {
      return '';
    }
  }
}
