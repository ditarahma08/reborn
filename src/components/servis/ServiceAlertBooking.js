import { Card, CardBody, CardTitle, Row, Tags } from '@components/otoklix-elements';
import { alertSettings } from '@utils/Constants';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import Slider from 'react-slick';

const ServiceAlertBooking = (props) => {
  const { alertData, hideAlerts, onHideAlert } = props;
  const router = useRouter();

  return (
    <Row className="m-0 mb-3">
      <Slider {...alertSettings}>
        <Card color="secondary" className="card-add-order mb-2">
          <CardBody
            data-automation="home_card_add_order"
            onClick={() => router.push(`/bengkel/${alertData?.bookings[0].workshop?.slug}`)}>
            <img src="/assets/images/add-order.png" height="52" loading="lazy" />
            <CardTitle>Tambah Pesanan</CardTitle>
          </CardBody>
        </Card>
        {alertData.bookings
          .filter((item) => !hideAlerts.includes(item.booking_code))
          .map((item) => {
            return (
              <Card
                key={item.booking_code}
                color="secondary-light"
                className="card-ongoing-order mb-2">
                <CardBody>
                  <div>
                    <CardTitle className="mb-2">{item.workshop?.name}</CardTitle>
                    <Tags
                      size="sm"
                      className=""
                      color="secondary"
                      textColor="white-lg"
                      tag="span"
                      title={`Hari ini, ${item?.workshop?.booking_time}`}
                    />
                    {item?.packages?.length > 0 && (
                      <Tags
                        size="sm"
                        className="ms-2"
                        color="white-lg"
                        textColor="black-lg"
                        tag="span"
                        title={`${item.packages[0]} ${
                          item.packages.length > 1 ? `+${item.packages.length - 1}` : ``
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-price title-active fw-weight-600">
                    {`Rp${Helper.formatMoney(item?.total_price, 0, ',', '.')} `}
                    <CardTitle
                      data-automation={`home_card_ongoing_order_${item?.booking_code}`}
                      onClick={() => router.push(`/order/${item?.booking_code}`)}
                      tag="span"
                      className="float-end">
                      <div className="d-flex">
                        <a
                          href={item?.workshop?.gmaps_link}
                          target="_blank"
                          className="link-maps"
                          rel="noreferrer">
                          Arahkan Saya
                        </a>
                        <img
                          src="/assets/icons/open-new-link-orange.svg"
                          className="ms-1"
                          alt="icon_open_link"
                          loading="lazy"
                        />
                      </div>
                    </CardTitle>
                  </div>
                </CardBody>
                <img
                  src="/assets/icons/circle-close.svg"
                  alt="icon_circle_close"
                  loading="lazy"
                  className="close-icon m-2"
                  onClick={() => onHideAlert([...hideAlerts, item.booking_code])}
                  aria-hidden="true"
                />
              </Card>
            );
          })}
      </Slider>
    </Row>
  );
};

export default ServiceAlertBooking;
