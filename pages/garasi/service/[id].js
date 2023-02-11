import CardService from '@components/card/CardService';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Col, Container, Header, Spinner } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { BottomSheet } from 'react-spring-bottom-sheet';

sentryBreadcrumb('pages/garasi/service/[id]');

const Index = () => {
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderActive, setOrderActive] = useState(null);

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  async function fetchOrders(payload) {
    setIsFetching(true);
    setLoading(true);
    authenticateAPI(token);

    if (payload?.restart) {
      setOrders([]);
    }

    const params = {
      status: 'finish',
      user_car_id: id,
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

  const handleLoadItems = (pageStart) => {
    !isFetching &&
      fetchOrders({
        page: pageStart
      });
  };
  const handlePrimaryClick = (bookingCode) => {
    setOrderActive(bookingCode);
    setSheetOpen(true);
  };

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 100; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setLoading(false);
    }
  };

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      wrapperClassName="wrapper-full"
      handleUpdate={onScrollUpdate}>
      <Header title="Riwayat Service" onBackClick={() => router.back()} />

      <Container className="home-content">
        <InfiniteScroll
          pageStart={0}
          loadMore={handleLoadItems}
          hasMore={hasMoreItems && !isLoading}
          useWindow={false}>
          <div className="tracks">
            {orders?.length > 0 ? (
              orders.map((order, index) => {
                if (order?.booking_status) {
                  const carName = `${order?.user_car.car_details.car_model.brand.name} ${order?.user_car.car_details.car_model.model_name} - ${order?.user_car.car_details.variant}`;
                  return (
                    <CardService
                      key={index}
                      badgeStatus={order?.booking_status?.slug}
                      title={order?.booking_code}
                      bookingCode={order?.booking_code}
                      subtitle={`${order?.user_car.license_plate} | ${carName}`}
                      info={order.booking_date}
                      rightImage={order?.user_car.car_details.car_model.image_link}
                      total_price={`Rp${Helper.formatMoney(order?.total_price)}`}
                      packages={order.packages}
                      primaryClick={handlePrimaryClick}
                    />
                  );
                }
              })
            ) : isFetching ? (
              ''
            ) : (
              <div className="d-flex justify-content-center p-3">
                <h6>Tidak ada Riwayat Service yang ditemukan.</h6>
              </div>
            )}

            {hasMoreItems ? loader : null}
          </div>
        </InfiniteScroll>
        <Col></Col>
      </Container>
      <BottomSheet open={sheetOpen} onDismiss={() => setSheetOpen(false)}>
        <div>
          <div
            role="button"
            aria-hidden="true"
            className="p-3"
            onClick={() => router.push(`/order/${orderActive}`)}>
            Lihat Detail
          </div>
          <div role="button" aria-hidden="true" className="p-3" onClick={() => null}>
            Re Order
          </div>
        </div>
      </BottomSheet>
    </PrivateLayout>
  );
};

export default Index;
