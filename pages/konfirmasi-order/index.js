import CardAddressBar from '@components/card/CardAddressBar';
import CardOrderDetail from '@components/card/CardOrderDetail';
import InputSelect from '@components/input/InputSelect';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { LottieCoin } from '@components/lottie/lottie';
import {
  Alert,
  Button,
  Container,
  FormGroup,
  FormText,
  Header,
  Input,
  Label,
  Stepper,
  Text
} from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { days, DEFAULT_LOCAL_DATETIME } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import MoEngage from '@utils/MoEngage';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import map from 'lodash/map';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

sentryBreadcrumb('pages/konfirmasi-order/index');

const AlertCarInfo = dynamic(() => import('@components/car/AlertCarInfo'));
const CustomModal = dynamic(() => import('@components/modal/CustomModal'));
const DateTimePickerNew = dynamic(() => import('@components/datepicker/DateTimePickerNew'));
const OtpVerification = dynamic(() => import('@components/otp/OtpVerification'));

const RingkasanOrder = () => {
  const router = useRouter();
  const { authenticate, token, user, isAuthenticated, setUser } = useAuth();
  const { package_id, workshop, origin, promo, otoklix_go } = router.query;
  const isOtoklixGo = otoklix_go === 'true';

  const userCar = Cookies.get('user_car', { path: '/' });
  const getUserAddress = Cookies.get('user_address', { path: '/' });
  const userAddress = getUserAddress && JSON.parse(getUserAddress);
  const carVariant = userCar && JSON.parse(userCar)?.car_details?.id;
  const carId = userCar && JSON.parse(userCar)?.id;
  const carLicensePlate = userCar && JSON.parse(userCar)?.license_plate;
  const addOnRef = useRef(null);

  const [invalidName, setInvalidName] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [disablePlate, setDisablePlate] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasOtp, setHasOtp] = useState(false);
  const [formState, setFormState] = useState('');

  const [dataOrderConfirmation, setDataOrderConfirmation] = useState({});
  const [packages, setPackages] = useState();
  const [packageItem, setPackageItem] = useState();
  const [workshopData, setWorkshopData] = useState();
  const [selectedServiceReceived, setSelectedServiceReceived] = useState('now');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [hasValidDate, setHasValidDate] = useState(true);
  const [forceLater, setForceLater] = useState(false);
  const [operatingHours, setOperatingHours] = useState({
    min: { openingHour: '06.00', closingHour: '24.00', isOpen: true },
    today: { openingHour: '06.00', closingHour: '24.00', isOpen: true }
  });
  const [laterDateTime, setLaterDateTime] = useState(DEFAULT_LOCAL_DATETIME);
  const [minimumBookingTime, setMinimumBookingTime] = useState('');
  const [isFBOPackages, setIsFBOPackages] = useState(false);
  const [addOnPrice, setAddOnPrice] = useState(addOnRef.current?.price ?? 0);
  const [addOnItem, setAddOnItem] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState();
  const [errorModal, setErrorModal] = useState(false);
  const [productViewed, setProductViewed] = useState(false);
  const [amplitudeValue, setAmplitudeValue] = useState({});
  const [closeWorkshopAlert, setCloseWorkshopAlert] = useState(false);
  const [promoCode, setPromoCode] = useState(promo || '');
  const [showAlert, setShowAlert] = useState(false);
  const [fboAlert, setFboAlert] = useState(isFBOPackages);
  const [otoklixGoStatus, setOtoklixGoStatus] = useState(false);
  const [exitAlertModal, setExitAlertModal] = useState(false);
  const [sourcePath, setSourcePath] = useState('');
  const [productPrice, setProductPrice] = useState();
  const [headerActive, setHeaderActive] = useState(false);
  const [fetchRevert, setFetchRevert] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const [location, setLocation] = useState({});

  const [userData, setUserData] = useState({
    username: null,
    phone_number: null,
    referral_code: null,
    email: null
  });

  const [carData, setCarData] = useState({
    car_name: '',
    licensePlatePrefix: '',
    licensePlateNumber: '',
    licensePlateSuffix: ''
  });

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  let source;
  if (origin === 'pilih-bengkel') {
    source = 'pilih bengkel page';
  } else if (origin === 'checkout') {
    source = 'payment page';
  } else {
    source = 'bengkel page';
  }

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
        username: user?.name,
        phone_number: Helper.removePhonePrefix(user?.phone_number)
      });
    }
  }, [user?.name, user?.phone_number]);

  useEffect(() => {
    if (userCar) {
      const plate = carLicensePlate?.split(' ');
      const carDetails = JSON.parse(userCar)?.car_details;
      setCarData({
        car_name: `${carDetails.car_model?.brand?.name} ${carDetails.car_model?.model_name} - ${carDetails?.variant}`,
        licensePlatePrefix: plate?.[0],
        licensePlateNumber: plate?.[1],
        licensePlateSuffix: plate?.[2]
      });
      carLicensePlate?.trim() !== '' && setDisablePlate(true);
    }
  }, [userCar?.car_details]);

  const onInputChange = (event) => {
    const { value, name } = event.target;

    if (name === 'username') {
      let nameValue = value.replace(/[^A-Za-z\s]/gi, '');
      if (nameValue && value !== '') {
        setInvalidName(false);
      } else {
        setInvalidName(true);
        setNameErrorMessage('Nama tidak boleh kosong');
      }
      setUserData({ ...userData, username: nameValue });
    }
  };

  const onChangePhoneNumber = (e) => {
    let phoneValue = e.target.value.replace(/[^0-9+]/g, '');
    phoneValue.replace(/(?!^\+)\+/g, '');
    if (phoneValue?.length < 13) {
      setUserData({ ...userData, phone_number: Helper.fixPhoneNumber(phoneValue) });
      setInvalidPhone(false);
      setPhoneErrorMessage('');
    }

    if (!phoneValue) {
      setInvalidPhone(true);
      setPhoneErrorMessage('Nomor Telepon tidak boleh kosong');
    } else if (phoneValue?.length < 9) {
      setInvalidPhone(true);
      setPhoneErrorMessage('Minimal 10 Karakter');
    }
  };

  const handleLicensePlatePrefix = (e) => {
    if (e.target.value.length < 3) {
      setCarData({
        ...carData,
        licensePlatePrefix: Helper.onlyAlphabetUpperCase(e.target.value)
      });
    }
  };

  const handleLicensePlateNumber = (e) => {
    let value = e.target.value.replace(/[^0-9+]/g, '');
    value.replace(/(?!^\+)\+/g, '');
    if (e.target.value.length < 5) {
      setCarData({
        ...carData,
        licensePlateNumber: value
      });
    }
  };

  const handleLicensePlateSuffix = (e) => {
    if (e.target.value.length < 4) {
      setCarData({
        ...carData,
        licensePlateSuffix: Helper.onlyAlphabetUpperCase(e.target.value)
      });
    }
  };

  const handleBack = () => {
    setExitAlertModal(true);
  };

  const handleLaterDateTime = (value, changeType) => {
    if (changeType == 'date-changed') {
      gtag('click jadwal booking', 'clickConfirmOrderPage', 'date');
    } else if (changeType == 'hour-changed') {
      gtag('click jadwal booking', 'clickConfirmOrderPage', 'time');
    }

    setLaterDateTime(value);
  };

  const handleSelectService = (e) => {
    setSelectedServiceReceived(e.target.value);

    amplitude.getInstance().logEvent('booking method changed', { option_type: e.target.value });

    if (e.target.value === 'now') {
      setLaterDateTime(minimumBookingTime);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    amplitude.getInstance().logEvent('checkout initiated', {
      service_category_name: packages?.package_detail?.main?.[0]?.category,
      product_name: packages?.package_detail?.main?.[0]?.name,
      workshop_name: workshopData?.name,
      is_fulfilled_by_otoklix: packages?.fbo,
      page_location: fullPath,
      add_on: addOnRef?.current?.name ? addOnRef?.current?.name : 'none'
    });

    if (isAuthenticated) {
      submitToPayment();
    } else {
      needAuth();
    }
  };

  const processLoginFlow = (data) => {
    setIsNewUser(data?.is_new_user);

    const payload = {
      username: userData?.username,
      ...data
    };

    loginWithPhone(payload);
  };

  const loginWithPhone = async (data) => {
    await api.post('v2/auth/send-otp-number/', data).then(() => {
      setFormState('otp');
    });
  };

  const submitChangeName = async () => {
    authenticate(token);
    const formData = new FormData();

    formData.append('name', userData?.username);

    await api
      .put('v2/account/profile/', formData)
      .then((response) => {
        setUser(response?.data?.data);
      })
      .catch((err) => {
        console.log(err?.response?.data?.error?.message);
        setHasOtp(false);
      });
  };

  const handleVerification = async () => {
    if (!isNewUser) {
      submitChangeName();
      submitToPayment();
    } else {
      submitToPayment();
    }
  };

  const needAuth = async () => {
    const payload = {
      phone_number: `0${userData?.phone_number}`,
      referral_code: ''
    };

    try {
      const response = await api.post('v2/auth/verify-phone/', payload);
      processLoginFlow(response?.data?.data);
      setHasOtp(true);
    } catch (err) {
      setInvalidPhone(true);
      setPhoneErrorMessage(err.response.data.error.message);
    }
  };

  const submitToPayment = async () => {
    authenticate(token);

    const licensePlate = `${carData?.licensePlatePrefix} ${carData?.licensePlateNumber} ${
      carData?.licensePlateSuffix ?? ''
    }`;

    const res = await api.get(
      `v2/garage/car/guest/exist?license_plate=${licensePlate}&variant_id=${carVariant}`
    );

    const licensePlateValidation = res?.data?.data;

    let packageDetails = [];
    if (packageItem) {
      packageItem?.map((item) => {
        packageDetails.push(item?.id);
      });
    }

    selectedPackages && packageDetails?.push(selectedPackages);

    gtag('click checkout', 'clickConfirmOrderPage');
    GtmEvents.gtmCheckoutKonfirmasiOrder(dataOrderConfirmation);

    let currentDateTime = moment();
    let bookingDateTime = moment(laterDateTime);
    let displayedDateTime = moment(laterDateTime);
    let finalDateTime;

    if (selectedServiceReceived == 'later') {
      displayedDateTime.set({ minutes: 0, seconds: 0 });
      if (displayedDateTime <= currentDateTime) {
        // case: current time = 16.25, 16 is still displayed in Hour Options
        // preserve minutes to have 16.56 instead of 16.00
        // 16.00 is before 16.25 and breaking Server Validation
        finalDateTime = bookingDateTime.set({ seconds: 0 });
      } else {
        // case: current time = 16.56, 16 is not displayed in Hour Options
        // the earliest hour will be 17.
        // remove minutes to have 17.00 instead of 17.26
        finalDateTime = bookingDateTime.set({ minutes: 0, seconds: 0 });
      }
    } else {
      // case: order now should add 30 minutes from now hour
      finalDateTime = bookingDateTime.add(30, 'minutes');
    }

    const params = {
      workshop_slug_name: workshop ?? workshopData?.slug,
      promo_code: promoCode,
      user_car: {
        id: carId ?? null,
        license_plate: licensePlate?.trim(),
        variant_id: carVariant
      },
      booking_datetime: finalDateTime.format('YYYY-MM-DD HH:mm:ss'),
      packages: [
        {
          package_id: packages?.id,
          package_details: packageDetails
        }
      ],
      booking_origin: 'web',
      is_pudo: otoklixGoStatus,
      customer_address_label: userAddress?.label || '',
      customer_address1: userAddress?.address1 || '',
      customer_address2: userAddress?.address2 || '',
      address1_latitude: userAddress?.latitude || '',
      address1_longitude: userAddress?.longitude || '',
      source_path: router?.query?.origin || ''
    };

    await api
      .post('v2/cart/add/', params)
      .then((res) => {
        const responseData = res.data.data;
        window.fbq('track', 'AddToCart', {
          currency: 'IDR',
          value: grandTotal,
          package_name: packages?.short_name,
          product_name: map(packageItem, 'name')
        });

        BranchTracker('ADD_TO_CART', {
          currency: 'IDR',
          value: grandTotal,
          package_name: packages?.short_name,
          product_name: map(packageItem, 'name')
        });

        const goToCheckout = () => {
          setFetchRevert(false);
          router.replace('/konfirmasi-order?origin=checkout');
          router.push(responseData?.web_view_url);
        };

        if (licensePlateValidation) {
          setShowAlert(true);
          setDisablePlate(true);

          setTimeout(() => {
            goToCheckout();
          }, 2000);
        } else {
          goToCheckout();
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setErrorMessage(e?.response?.data?.error?.message);
        setErrorModal(true);
      });
  };

  const countHoursLimit = (date, wsSchedules) => {
    const day = wsSchedules?.find((schedule) => {
      return schedule?.day === days[new Date(date).getDay()];
    });
    const today = wsSchedules?.find((schedule) => {
      return schedule?.day === days[new Date().getDay()];
    });

    setOperatingHours({
      min: {
        openingHour: day?.opening_hour,
        closingHour: day?.closing_hour,
        isOpen: day?.is_open
      },
      today: {
        openingHour: today?.opening_hour,
        closingHour: today?.closing_hour,
        isOpen: today?.is_open
      }
    });
  };

  const setCloseAlert = (open, closing, isOpen) => {
    const minBooking = parseInt(open?.replace('.', ''));
    const maxBooking = parseInt(closing?.replace('.', ''));
    const bookingHours = parseInt(moment().add(30, 'minutes').format('HH:mm').replace(':', ''));

    const diffOpen = minBooking - bookingHours;
    const diffClose = maxBooking - bookingHours;
    const isClosed = (diffOpen > -30 || diffClose < -30 || !isOpen) && !isFBOPackages;

    if (isClosed) {
      setHasValidDate(false);
    } else {
      setHasValidDate(true);
    }

    if (isClosed || isFBOPackages) {
      setForceLater(true);
      setSelectedServiceReceived('later');
    } else {
      setForceLater(false);
    }
  };

  const calculateFinalAmounts = () => {
    let grandTotal = 0;

    grandTotal = productPrice + addOnPrice;

    return { grandTotal };
  };

  const { grandTotal } = calculateFinalAmounts();

  const fetchPackageOrder = async () => {
    setIsFetching(true);
    const lat = userAddress?.latitude ? userAddress.latitude : location.lat;
    const lng = userAddress?.longitude ? userAddress.longitude : location.lng;
    const params = {
      package_id: package_id,
      variant_car_id: carVariant,
      promo: router?.query?.promo || '',
      is_pudo: router?.query?.otoklix_go,
      location: lat + ',' + lng
    };

    await api
      .get(`v2/cart/${workshop}/package`, { params })
      .then((res) => {
        const response = res.data.data;
        setOtoklixGoStatus(response?.otoklix_go_eligible);
        setPackages(response?.package);
        setWorkshopData(response?.workshop);
        setPackageItem(response?.package?.package_detail?.main);
        setAddOnItem(response?.package?.package_detail?.optional);
        setProductPrice(response?.package?.price);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
        setErrorMessage(e?.response?.data?.error?.message);
        setErrorModal(true);
      });
  };

  const fetchSchedule = async (packageId, workshop) => {
    const params = {
      workshop_slug: workshop,
      package_id: packageId,
      is_pudo: otoklixGoStatus
    };

    const response = await api.get(`v2/cart/schedule`, { params });
    const data = response?.data?.data;
    const minimumDateTime = data?.minimum_booking_time;

    setDataOrderConfirmation(data);
    setIsFBOPackages(data?.packages_is_fbo);
    setFboAlert(data?.packages_is_fbo);

    setLaterDateTime(minimumDateTime);
    setMinimumBookingTime(minimumDateTime);
    countHoursLimit(minimumDateTime, data?.operating_hours?.schedule);
  };

  const handleClickBack = () => {
    if (sourcePath === 'pilih bengkel') {
      router.push(`/bengkel/${workshopData?.slug}`);
    } else {
      router.back();
    }
  };

  const fetchRevertPackageOrder = async () => {
    setIsFetching(true);

    await api
      .get('v2/cart/package/revert')
      .then((res) => {
        const response = res.data.data;
        const plate = response?.user_car?.license_plate?.split(' ');
        setOtoklixGoStatus(response?.otoklix_go_eligible);
        setPackages(response?.package);
        setWorkshopData(response?.workshop);
        setPackageItem(response?.package?.package_detail?.main);
        setAddOnItem(response?.package?.package_detail?.optional);
        setPromoCode(response?.promo_code);
        setCarData({
          car_name: response?.user_car?.name,
          licensePlatePrefix: plate?.[0],
          licensePlateNumber: plate?.[1],
          licensePlateSuffix: plate?.[2]
        });
        setLaterDateTime(response?.booking_date);
        setDisablePlate(true);
        setIsFetching(false);
        setSourcePath(response?.source_path);
        setProductPrice(response?.package?.price);
      })
      .catch(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (package_id && workshop && carVariant) {
      fetchPackageOrder();
    }

    if ((package_id && workshop) || otoklixGoStatus) {
      if (origin !== 'checkout') {
        fetchSchedule(package_id, workshop);
      }
    }
  }, [package_id, workshop, carVariant, otoklixGoStatus]);

  useEffect(() => {
    if (isAuthenticated && origin === 'checkout' && fetchRevert) {
      fetchRevertPackageOrder();
    }
  }, [isAuthenticated, origin, fetchRevert]);

  useEffect(() => {
    if (workshopData && packages && origin === 'checkout' && fetchRevert) {
      fetchSchedule(packages?.id, workshopData?.slug);
    }
  }, [workshopData, packages, origin, fetchRevert]);

  useEffect(() => {
    setCloseAlert(
      operatingHours?.today?.openingHour,
      operatingHours?.today?.closingHour,
      operatingHours?.today?.isOpen
    );
  }, [operatingHours]);

  useEffect(() => {
    gtag('view order and booking detail', 'viewConfirmOrderPage');

    if (packages && workshopData) {
      amplitude.getInstance().logEvent('product details viewed', {
        is_fulfilled_by_otoklix: packages?.fbo,
        page_location: fullPath,
        product_name: packages?.package_detail?.main?.[0]?.name,
        service_category_name: packages?.package_detail?.main?.[0]?.category,
        source_list: source,
        workshop_name: workshopData?.name
      });
      setProductViewed(true);
    }
  }, [packages, workshopData]);

  useEffect(() => {
    setAmplitudeValue({
      ...amplitudeValue,
      is_fulfilled_by_otoklix: packages?.fbo,
      page_location: fullPath,
      service_category_name: packages?.package_detail?.main?.[0]?.category
    });

    if (productViewed && packages && workshopData && origin !== 'checkout') {
      amplitude.getInstance().logEvent('product added to cart', {
        ...amplitudeValue,
        product_name: packages?.package_detail?.main?.[0]?.name,
        source_list: 'default product',
        workshop_name: workshopData?.name
      });
    } else if (productViewed && packages && workshopData && origin === 'checkout') {
      const selectedPackage = packages?.package_detail?.optional?.find(
        (item) => item?.is_selected === true
      );

      amplitude.getInstance().logEvent('product added to cart', {
        ...amplitudeValue,
        product_name: selectedPackage
          ? selectedPackage?.name
          : packages?.package_detail?.main?.[0]?.name,
        source_list: selectedPackage ? 'add-on product' : 'default product',
        workshop_name: workshopData?.name
      });
    }
  }, [productViewed, packages]);

  useEffect(() => {
    if (selectedServiceReceived === 'later') {
      gtag('click pesan servis kapan', 'clickConfirmOrderPage');
    }
  }, [selectedServiceReceived]);

  useEffect(() => {
    if (!hasValidDate) setCloseWorkshopAlert(true);
  }, [hasValidDate]);

  useEffect(() => {
    otoklixGoStatus ? setSelectedServiceReceived('later') : setSelectedServiceReceived('now');
  }, [otoklixGoStatus]);

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'cart',
      screen_category: 'checkout',
      page_location: fullPath
    });
    MoEngage.trackEvent('screen viewed', {
      screen_name: 'cart',
      page_location: fullPath
    });

    setHasMounted(true);

    const getDataLocation = Helper.getLocation();
    if (getDataLocation !== null) {
      setLocation(getDataLocation);
    }
  }, []);

  const disabledNextPage =
    !userData?.username ||
    !userData?.phone_number ||
    (!carData?.licensePlatePrefix && origin !== 'checkout') ||
    (!carData?.licensePlateNumber && origin !== 'checkout') ||
    invalidName ||
    invalidPhone ||
    isFetching ||
    isLoading;

  const hasOtopointReward = grandTotal > 0 && !promoCode;

  const onScrollUpdate = (values) => {
    const { scrollTop } = values;

    if (scrollTop > 0) {
      setHeaderActive(true);
    } else {
      setHeaderActive(false);
    }
  };

  const handleCloseOtp = () => {
    setIsLoading(false);
    setHasOtp(false);
  };

  if (hasMounted) {
    return (
      <PrivateLayout
        title="Konfirmasi Order | Otoklix"
        description=""
        metaRobots="noindex"
        hasAppBar={false}
        wrapperClassName="wrapper-full"
        handleUpdate={onScrollUpdate}>
        {hasOtp ? (
          <OtpVerification
            phoneNumber={`0${userData?.phone_number}`}
            username={userData?.username}
            closeOtp={handleCloseOtp}
            origin="modal"
            onVerificationSubmit={() => handleVerification()}
            formState={formState}
            fullPath={fullPath}
          />
        ) : (
          <>
            <Header
              title="Ringkasan Order"
              onBackClick={handleBack}
              className={`bg-white sticky-top ${headerActive && 'shadow-sm'}`}
            />
            <Container className="stepper-wrapper">
              <Stepper data={[{ title: 'Order Saya' }, { title: 'Pembayaran' }]} activeStep={0} />
            </Container>
            {otoklixGoStatus && userAddress && (
              <CardAddressBar addressDetail={userAddress} hasSparatorComponent />
            )}
            <Container className="order-wrapper">
              <Text className="title" tag="span" color="body">
                Rincian Order
              </Text>

              <CardOrderDetail
                packages={packageItem}
                workshop={workshopData}
                isFetching={isFetching}
              />

              {addOnItem?.length > 0 && (
                <InputSelect
                  packages={addOnItem}
                  setAddOnPrice={setAddOnPrice}
                  setSelectedPackages={setSelectedPackages}
                  fromCheckout={origin === 'checkout'}
                  addOnRef={addOnRef}
                  amplitudeValue={amplitudeValue}
                  workshopName={workshopData?.name}
                  productName={packages?.package_detail?.main?.[0]?.name}
                  disabled={showAlert}
                />
              )}
            </Container>
            <hr className="page-devider-small" />
            <Container className="pt-2 pb-1">
              <FormGroup>
                <Label className="fw-weight-600 text-md mb-1 mt-2 required">
                  Merek & Tipe Mobil
                </Label>
                <Input
                  className="input-order-confirmation select-search border-7"
                  bsSize="sm"
                  value={carData?.car_name}
                  data-automation="order_confirmation_car_name"
                  disabled
                />
              </FormGroup>

              <FormGroup>
                <Label className="required mb-1 text-md fw-weight-600">Plat Nomor</Label>
                <div className="d-flex license-plate-block">
                  <Input
                    className="input-order-confirmation text-center w-25 me-2 border-7"
                    name="license-plate-prefix"
                    placeholder="AB"
                    onChange={handleLicensePlatePrefix}
                    value={carData?.licensePlatePrefix}
                    bsSize="sm"
                    autoComplete="off"
                    data-automation="order_confirmation_license_plate_prefix"
                    disabled={disablePlate}
                  />
                  <Input
                    className="input-order-confirmation text-center w-50 me-2 border-7"
                    name="license-plate-number"
                    placeholder="1234"
                    onChange={handleLicensePlateNumber}
                    value={carData?.licensePlateNumber}
                    bsSize="sm"
                    type="tel"
                    autoComplete="off"
                    data-automation="order_confirmation_license_plate_number"
                    disabled={disablePlate}
                  />
                  <Input
                    className="input-order-confirmation text-center w-25 p-3 border-7"
                    name="license-plate-suffix"
                    placeholder={disablePlate && !carData?.licensePlateSuffix ? '' : 'REF'}
                    onChange={handleLicensePlateSuffix}
                    value={carData?.licensePlateSuffix}
                    bsSize="sm"
                    autoComplete="off"
                    data-automation="order_confirmation_license_plate_suffix"
                    disabled={disablePlate}
                  />
                </div>
              </FormGroup>
            </Container>
            <hr className="page-devider-small" />
            <Container className="pt-2 pb-1">
              <FormGroup>
                <Label className="required mb-1 text-md fw-weight-600">Nama</Label>
                <Input
                  name="username"
                  bsSize="sm"
                  value={userData?.username}
                  onChange={onInputChange}
                  placeholder="Masukkan Nama"
                  invalid={invalidName}
                  disabled={user?.name}
                  className="input-order-confirmation border-7"
                  data-automation="order_confirmation_user_name"
                />
                {invalidName && (
                  <FormText className="text-xs" color="danger">
                    {nameErrorMessage}
                  </FormText>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="required mb-1 text-md fw-weight-600">Nomor Telephone</Label>
                <div className="InputAddOn">
                  <div className="InputAddOn-item align-items-center d-flex">
                    <span className="mb-0">+62</span>
                  </div>
                  <Input
                    name="phone"
                    bsSize="sm"
                    type="tel"
                    className="input-order-confirmation InputAddOn-field"
                    value={userData?.phone_number}
                    onChange={onChangePhoneNumber}
                    placeholder="Masukkan Nomor Telepon"
                    invalid={invalidPhone}
                    disabled={user?.phone_number}
                    maxLength={15}
                    data-automation="order_confirmation_user_phone"
                  />
                </div>
                {invalidPhone && (
                  <FormText className="text-xs" color="danger">
                    {phoneErrorMessage}
                  </FormText>
                )}
              </FormGroup>
            </Container>
            <hr className="page-devider-small" />
            <Container className={`time-wrapper${hasOtopointReward ? '-up' : ''}`}>
              <Text className="title" tag="span" color="body">
                Kapan Mau Servis?
              </Text>

              {!isOtoklixGo && !otoklixGoStatus && (
                <>
                  {closeWorkshopAlert && (
                    <Alert
                      className="mt-2 border-7"
                      borderColor="danger"
                      textColor="danger"
                      onClose={() => setCloseWorkshopAlert(false)}>
                      Sayangnya workshop sudah tutup.
                      <br />
                      Pesan untuk nanti dan pilih tanggal esok hari.
                    </Alert>
                  )}

                  {fboAlert && (
                    <Alert
                      className={!hasValidDate ? 'mt-2 mb-3 border-7' : 'my-3 border-7'}
                      borderColor="danger"
                      textColor="danger"
                      onClose={() => setFboAlert(false)}>
                      Ups! Order ini hanya bisa diproses di hari selanjutnya.
                    </Alert>
                  )}
                </>
              )}

              {!isOtoklixGo && !otoklixGoStatus && (
                <FormGroup className="mt-2" check>
                  <Label
                    className="d-flex"
                    check={selectedServiceReceived === 'now'}
                    disabled={forceLater || showAlert}>
                    <Input
                      data-automation="order_confirmation_date_input"
                      defaultChecked={hasValidDate}
                      className="input-radio me-2"
                      type="radio"
                      name="selectservice"
                      value="now"
                      checked={selectedServiceReceived === 'now'}
                      onClick={handleSelectService}
                      disabled={forceLater || showAlert}
                    />
                    <Text className="text-xs mt-1">Order sekarang</Text>
                  </Label>
                </FormGroup>
              )}

              <FormGroup className="mt-2 mb-3" check>
                <Label
                  disabled={showAlert}
                  className="d-flex"
                  check={selectedServiceReceived === 'later'}>
                  <Input
                    disabled={showAlert}
                    data-automation="order_confirmation_hour_input"
                    className="input-radio me-2"
                    type="radio"
                    name="selectservice"
                    value="later"
                    checked={selectedServiceReceived === 'later'}
                    onClick={handleSelectService}
                  />
                  <Text className="text-xs mt-1">Order untuk nanti</Text>
                </Label>
              </FormGroup>

              {selectedServiceReceived === 'later' && (
                <DateTimePickerNew
                  disabledDates={dataOrderConfirmation?.operating_hours?.closed_dates}
                  value={laterDateTime}
                  schedule={operatingHours}
                  onChange={handleLaterDateTime}
                  minimumDateTime={minimumBookingTime}
                  fullPath={fullPath}
                  countHoursLimit={countHoursLimit}
                  wsSchedules={dataOrderConfirmation?.operating_hours?.schedule}
                  isFbo={isFBOPackages}
                  disabled={showAlert}
                  isOtoklixGo={isOtoklixGo}
                />
              )}
            </Container>

            <div className="shadow px-0">
              {hasOtopointReward && (
                <div className="getotopoint-wrapper d-flex justify-content-center align-items-center">
                  Akan mendapatkan <LottieCoin />{' '}
                  <div className="ms-1">{`+${Helper.formatMoney(
                    Helper.OtopointsCalc(grandTotal)
                  )} Points`}</div>
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between px-3 my-3">
                <div className="d-flex flex-column">
                  <span className="text-total-tagihan">Total Bayar</span>
                  <span className="text-jumlah-total-tagihan">
                    {isFetching ? (
                      <Skeleton width={120} height={20} className="mt-1 mb-0" />
                    ) : (
                      `Rp${Helper.formatMoney(grandTotal)}`
                    )}
                  </span>
                </div>
                <Button
                  data-automation="order_confirmation_button_checkout"
                  id="button_checkout"
                  color="primary"
                  size="md"
                  type="submit"
                  className="rounded-pill w-50"
                  onClick={handleAddPackage}
                  loading={isLoading}
                  disabled={disabledNextPage}>
                  Proses Order
                </Button>
              </div>
            </div>
          </>
        )}

        <AlertCarInfo
          carName={carData?.car_name}
          message={`Anda memindahkan plate nomor tersebut ke mobil ${carData?.car_name}`}
          show={showAlert}
          fromCheckout
        />

        <AlertCarInfo carName={carData?.car_name} />

        <CustomModal
          show={errorModal}
          title="Sorry"
          caption={errorMessage}
          submitButton="Close"
          imageUrl="/assets/images/sorry.png"
          onSubmit={() => setErrorModal(false)}
          submitButtonColor="danger"
          buttonPill
          cancelButton="Back"
          onCancel={() => router.back()}
          cancelButtonColor="danger"
        />

        <CustomModal
          show={exitAlertModal}
          title="Yakin Ingin Kembali?"
          caption="Kamu akan dibawa ke halaman sebelumnya"
          submitButton="Yakin"
          imageUrl="/assets/images/sorry.png"
          onSubmit={() => handleClickBack()}
          buttonPill
          cancelButton="Batal"
          onCancel={() => setExitAlertModal(false)}
        />
      </PrivateLayout>
    );
  }

  return null;
};

export default RingkasanOrder;
