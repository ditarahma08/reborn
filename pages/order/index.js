import CardOrder from '@components/card/CardOrder';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Col, Container, EmptyState, Header, Spinner, Tags } from '@components/otoklix-elements';
import RatingFormBundle from '@components/rating-review/RatingFormBundle';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import InfiniteScroll from 'react-infinite-scroller';

sentryBreadcrumb('pages/order/index');

const Index = () => {
  const { authenticate, token, isAuthenticated } = useAuth();

  const [filterActive, setFilterActive] = useState('all');
  const [orders, setOrders] = useState([]);
  const [orderFilters, setOrderFilters] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [reviewForm, setReviewForm] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  async function fetchOrders(payload) {
    setIsFetching(true);
    setLoading(true);
    authenticate(token);

    const params = {
      status: payload?.filter || ``,
      limit: 5,
      page: payload?.page || 1
    };

    const response = await api.get(`v2/bookings/list/`, { params });

    if (response.data.data.length < 5) setHasMoreItems(false);
    if (payload?.restart) {
      setOrders(response.data.data);
    } else {
      setOrders([...orders, ...response.data.data]);
    }
    setIsFetching(false);
  }

  async function fetchBookingFilter() {
    authenticateAPI(token);
    const response = await api.get(`v2/bookings/filter/`);

    setOrderFilters(response.data.data.filters);
  }

  const handleClickFilter = (filter) => {
    setFilterActive(filter);
    setPageIndex(1);
    setHasMoreItems(true);
    fetchOrders({ filter: filter, restart: true });
  };

  const handleLoadItems = () => {
    setPageIndex(pageIndex + 1);
    fetchOrders({
      filter: filterActive,
      page: pageIndex + 1
    });
  };

  useEffect(() => {
    fetchOrders({ filter: filterActive });
    fetchBookingFilter();
  }, []);

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 100; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setLoading(false);
    }
  };

  const openReviewForm = (code) => {
    setBookingCode(code);
    setReviewForm(true);
  };

  useEffect(() => {
    fetchOrders({ filter: filterActive });
    fetchBookingFilter();

    if (isAuthenticated) {
      amplitude.getInstance().logEvent('screen viewed', {
        screen_name: 'my order',
        screen_category: 'browse',
        page_location: fullPath
      });
    }
  }, []);

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  return (
    <PrivateLayout
      title="Order | Otoklix"
      description=""
      metaRobots="noindex"
      wrapperClassName="wrapper-full"
      handleUpdate={onScrollUpdate}>
      <Header title="Order Saya" className="text-nowrap" dataAutomationTitle="order_list_title" />

      <Container className="home-content">
        {/* filter section */}
        <Col>
          <div className="quick-filter mb-4">
            <ScrollMenu
              alignCenter={false}
              data={orderFilters.map((filter, index) => {
                return (
                  <Tags
                    key={index}
                    onClick={() => handleClickFilter(filter.slug)}
                    className="tags"
                    active={filter.slug == filterActive}
                    size="md"
                    color="input-bg"
                    textColor="label"
                    title={filter.name}
                    data-automation={`order_list_${filter.name
                      .toLowerCase()
                      .split(' ')
                      .join('_')}_tab`}
                  />
                );
              })}
            />
          </div>
        </Col>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleLoadItems}
          hasMore={hasMoreItems && !isLoading}
          useWindow={false}>
          <div className="tracks">
            {orders?.length > 0 ? (
              orders.map((order, index) => {
                if (order?.booking_status) {
                  const carName = `${order?.user_car?.car_details?.car_model?.brand?.name} ${order?.user_car?.car_details?.car_model?.model_name} - ${order?.user_car?.car_details?.variant}`;
                  return (
                    <CardOrder
                      key={index}
                      badgeStatus={order?.booking_status?.slug}
                      title={order?.booking_code}
                      subtitle={`${order?.user_car.license_plate || ''} ${
                        order?.user_car?.license_plate ? '|' : ''
                      } ${carName}`}
                      info={moment(order.booking_date).format('D MMMM YYYY')}
                      rightImage={order?.user_car.car_details.car_model.image_link}
                      total_price={`Rp${Helper.formatMoney(order?.total_price)}`}
                      packages={order.packages}
                      maximumTime={order?.maximum_confirmation_time}
                      addReview={() => openReviewForm(order?.booking_code)}
                      isReviewed={order.is_reviewed}
                      isMultiplePackage={order?.is_multiple_package}
                      paymentMethod={order?.pay_method}
                      carId={order?.user_car?.id}
                      workshopSlug={order?.workshop?.slug}
                      expiredPaymentTime={
                        order?.payment_details?.expired_at
                          ? [
                              moment(order?.payment_details?.expired_at).format('D-MM-YYYY'),
                              moment(order?.payment_details?.expired_at).format('HH:mm')
                            ]
                          : null
                      }
                      paymentType={order?.payment_details?.method_name}
                      index={index}
                    />
                  );
                }
              })
            ) : isFetching ? (
              ''
            ) : (
              <div className="d-flex justify-content-center p-3">
                <EmptyState
                  image="/assets/images/sorry.png"
                  title=" Tidak ada order yang ditemukan."
                  imgHeight={140}
                  imgAlt="Otoklix Search"></EmptyState>
              </div>
            )}

            {hasMoreItems ? loader : null}
          </div>
        </InfiniteScroll>
        <Col></Col>

        <RatingFormBundle
          open={reviewForm}
          bookingCode={bookingCode}
          onClose={() => setReviewForm(false)}
          onOpen={() => setReviewForm(true)}
        />
      </Container>
    </PrivateLayout>
  );
};

export default Index;
