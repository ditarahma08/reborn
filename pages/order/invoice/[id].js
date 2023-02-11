import BookingBadge from '@components/badge/BookingBadge';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Card,
  CardSubtitle,
  CardTitle,
  Container,
  Header,
  Text,
  WidgetListItem
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/order/invoice/[id]');

const Invoice = () => {
  const router = useRouter();
  const [bookingID, setBookingID] = useState();

  const { token, isAuthenticated } = useAuth();

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const [booking, setBooking] = useState(null);

  async function fetchDetailBooking() {
    authenticateAPI(token);

    const response = await api.get(`v2/bookings/${id}/`);
    setBooking(response.data.data);
    setBookingID(response.data.data.booking_code);
  }

  const carNameDetail = (booking) => {
    // prettier-ignore
    return `${booking?.user_car?.car_details?.car_model?.brand?.name} ${booking?.user_car?.car_details?.car_model?.model_name} ${booking?.user_car?.car_details?.variant} ${Helper.transmissionConverter(booking?.user_car?.transmission, '')} ${Helper.fuelConverter(booking?.user_car?.car_details?.fuel, '')} ${booking?.user_car?.license_plate}`;
  };

  const downloadCustomerInvoice = () => {
    getCustomerInvoice();
  };

  async function getCustomerInvoice() {
    const response = await api.get(`v2/bookings/generate-customer-invoice/?booking_code=${id}`, {
      responseType: 'blob'
    });
    var file = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    var fileURL = document.createElement('a');
    fileURL.href = file;
    fileURL.setAttribute('download', `invoice-${bookingID}.pdf`);

    // Append to html link element page
    document.body.appendChild(fileURL);
    // Start download
    fileURL.click();
    // Clean up and remove the link
    fileURL.parentNode.removeChild(fileURL);
  }

  useEffect(() => {
    fetchDetailBooking();
  }, []);

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      <Header
        title="Invoice"
        onBackClick={() => router.back()}
        className="bg-primary"
        headerTextClassName="text-off-white"
        rightImageSrc="/assets/icons/download.svg"
        rightImageClick={downloadCustomerInvoice}
      />

      <Container className="p-3 bg-primary invoice-content">
        <Text tag="div" weight="semi-bold" className="mb-1 fs-6">
          {booking?.workshop?.name}
        </Text>
        <Text tag="div" weight="normal" className="mb-1 fs-7">
          {booking?.booking_code}
        </Text>
        <Text tag="div" weight="normal" className="mb-3 fs-7">
          {moment(booking?.booking_datetime).format('DD MMM YYYY - HH:mm')} WIB
        </Text>

        <BookingBadge status={booking?.booking_status?.slug} />

        <div className="d-flex justify-content-center invoice-center-box">
          <div className="text-center">
            <Text tag="div" className="fs-6 fw-weight-600">
              Total Pembayaran
            </Text>
            <Text tag="div" className="fs-5 fw-weight-700 text-secondary">{`Rp${Helper.formatMoney(
              booking?.total_price
            )}`}</Text>
          </div>
        </div>
      </Container>
      <Container className="p-3">
        <Text tag="div" className="text-placeholder fw-weight-600 fs-8 mb-2">
          INFORMASI MOBIL
        </Text>
        <Text tag="div" className="text-body fw-weight-600 fs-6 mt-1">
          {carNameDetail(booking)}
        </Text>

        <div className="item-invoice mb-4">
          <WidgetListItem
            className="mt-3"
            title="ITEM"
            titleClassName="text-placeholder fw-weight-600 fs-8"
            subtitle="TOTAL"
            subtitleColor="secondary"
            subtitleClassName="text-placeholder fw-weight-600 fs-8"
          />

          {booking?.packages?.map((item, index) => (
            <>
              <WidgetListItem
                key={index}
                className="mt-1"
                title={item?.name}
                titleClassName="text-body fw-weight-600 w-100"
                subtitle={`Rp${Helper.formatMoney(item?.total_price)}`}
                subtitleColor="primary"
                subtitleClassName="fw-weight-600 w-50 text-end"
              />

              {item?.package_details?.map((detail, idx) => (
                <WidgetListItem
                  key={idx}
                  className="mt-1 ms-2"
                  title={`- ${detail?.name}`}
                  titleClassName="text-placeholder fw-weight-600 w-100"
                  subtitle={`${
                    detail?.category === 'custom' && detail?.quantity > 1
                      ? `${detail?.quantity} x `
                      : ''
                  } Rp${Helper.formatMoney(detail.price)}`}
                  subtitleColor="primary"
                  subtitleClassName="fw-weight-600 w-50 text-end"
                />
              ))}
            </>
          ))}

          {booking?.total_point_spent > 0 && (
            <WidgetListItem
              className="mt-1"
              title="Otopoints"
              titleClassName="text-body fw-weight-600 w-100"
              subtitle={`- Rp${Helper.formatMoney(booking?.total_point_spent)}`}
              subtitleColor="primary"
              subtitleClassName="fw-weight-600 w-50 text-end"
            />
          )}

          {booking?.promo?.promo_code && (
            <WidgetListItem
              className="mt-1"
              title={`Promo (${booking?.promo?.promo_code})`}
              titleClassName="text-body fw-weight-600 w-100"
              subtitle={`- Rp${Helper.formatMoney(booking?.discount_promo)}`}
              subtitleColor="primary"
              subtitleClassName="fw-weight-600 w-50 text-end"
            />
          )}
        </div>

        {booking?.total_point_get > 0 && (
          <Card className="card-info-otopoints-normal p-2 mb-4">
            <CardTitle className="mb-2">Total OtoPoints akan didapatkan</CardTitle>
            <CardSubtitle className="text-primary">{`+ ${Helper.formatMoney(
              booking?.total_point_get
            )} Points`}</CardSubtitle>
          </Card>
        )}

        <Text tag="div" className="text-placeholder fw-weight-600 fs-8">
          CATATAN
        </Text>
        <Text tag="div" className="text-body fw-weight-600 fs-7 mt-2">
          {booking?.booking_note ? booking?.booking_note : 'Tidak ada catatan'}
        </Text>
      </Container>
    </PrivateLayout>
  );
};

export default Invoice;
