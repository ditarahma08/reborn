import { getAllNotification } from '@actions/Notifications';
import DetailEvent from '@components/detail-event/DetailEvent';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Badge, Container, Header, Spinner, Tags } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import { assign } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import InfiniteScroll from 'react-infinite-scroller';

sentryBreadcrumb('pages/notification/index');

const Notification = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [notificationList, setNotificationList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hasDetailEvent, setHasDetailEvent] = useState(false);
  const [detailEvent, setDetailEvent] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotificationsFilter = async () => {
    authenticateAPI(token);
    const response = await api.get('v2/notifications/filters/');
    setFilters(response.data.data.filters);
  };

  const fetchNotifications = async (filter, page, restart = true) => {
    authenticateAPI(token);
    setIsFetching(true);

    getAllNotification(filter, page, 8)
      .then((res) => {
        if (res?.data?.length < 8) {
          setHasMoreItems(false);
        }

        if (restart) {
          setNotificationList(res?.data);
        } else {
          setNotificationList([...notificationList, ...res?.data]);
        }

        setCurrentPage(res?.pagination?.current_page);
        setIsFetching(false);
      })
      .catch((error) => {
        setHasMoreItems(false);
        if (error?.error?.status_code === 401) {
          location.reload();
        }
      });
  };

  const handleLoadItems = () => {
    setLoading(true);
    !isFetching && fetchNotifications(activeFilter, currentPage + 1, false);
  };

  const changeActiveFilter = (value) => {
    gtag('click filter', 'clickNotificationCenter', value);

    setNotificationList([]);
    setCurrentPage(1);
    setActiveFilter(value);
    setIsFetching(true);
    setHasMoreItems(true);
    fetchNotifications(value, 1, true);
  };

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" />
    </div>
  );

  const noData = (
    <div className="d-flex flex-column align-items-center justify-content-center p-3">
      <img src="/assets/images/thankyou.png" alt="" width="150" />
      <span>Tidak ada notifikasi saat ini</span>
    </div>
  );

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 100; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setLoading(false);
    }
  };

  const onReadNotification = async (item) => {
    gtag(
      'click notifcenter content',
      'clickNotificationCenter',
      item?.template_notification?.title
    );

    if (item.is_read === 0) {
      authenticateAPI(token);

      api
        .get(`v2/notifications/${item.id}/`)
        .then(() => {
          fetchNotifications(activeFilter, 1, true);
          setHasMoreItems(true);
        })
        .catch(() => {
          setHasMoreItems(false);
        });
    }

    let query = {};
    const urlRedirect = item?.template_notification?.redirect_params?.redirect_to;
    const booking_code = item?.template_notification?.redirect_params?.booking_code;
    const service_category = item?.template_notification?.redirect_params?.category;

    switch (item?.template_notification?.template_type) {
      case 'transaction':
        if (urlRedirect === 'thank-you') {
          assign(query, { booking_code });
        }

        if (urlRedirect === 'explore/maps') {
          assign(query, { service_category });
        }

        router.push({
          pathname: urlRedirect === 'explore/maps' ? 'bengkel' : urlRedirect,
          query: query
        });
        break;
      case 'promo':
        router.push('/promo');
        break;
      case 'event':
        setDetailEvent(item);
        setHasDetailEvent(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchNotifications(activeFilter, 1, true);
    fetchNotificationsFilter();
  }, []);

  useEffect(() => {
    gtag('view notifcenter', 'viewNotificationCenter');
  }, []);

  return (
    <PrivateLayout
      title="Notifikasi | Otoklix"
      description=""
      metaRobots="noindex"
      hasAppBar={false}>
      {hasDetailEvent ? (
        <DetailEvent
          data={detailEvent}
          onBackClick={() => {
            setHasDetailEvent(false);
            setDetailEvent({});
          }}
        />
      ) : (
        <>
          <Header onBackClick={() => router.back()} title="Notifikasi" />

          <Container className="wrapper-content">
            <div className="quick-filter">
              <ScrollMenu
                alignCenter={false}
                data={filters.map((filter) => {
                  return (
                    <Tags
                      key={filter}
                      onClick={() => changeActiveFilter(filter)}
                      className="tags text-capitalize"
                      active={filter === activeFilter}
                      size="md"
                      color="input-bg"
                      textColor="label"
                      title={
                        filter === 'transaction'
                          ? 'transaksi'
                          : filter === 'others'
                          ? 'Pesan'
                          : filter
                      }
                    />
                  );
                })}
              />
            </div>
          </Container>

          <Scrollbars
            autoHide
            autoHeight
            autoHeightMin={'calc(100vh - 146px)'}
            universal={true}
            onUpdate={onScrollUpdate}>
            <InfiniteScroll
              pageStart={0}
              loadMore={handleLoadItems}
              hasMore={hasMoreItems && !isLoading}
              useWindow={false}>
              {notificationList?.length > 0 &&
                notificationList.map((item) => {
                  const notifItem = item.template_notification;

                  return (
                    <div
                      role="button"
                      key={item.id}
                      className={`p-3 border-bottom cursor-pointer notification-item${
                        item.is_read === 0 ? ' isUnread' : ''
                      }`}
                      tabIndex={0}
                      onClick={() => onReadNotification(item)}>
                      {notifItem.image_banner_link && (
                        <img
                          src={notifItem.image_banner_link}
                          alt=""
                          width="100%"
                          className="rounded mb-3"
                        />
                      )}

                      <span className="fs-7 title">{notifItem.title}</span>

                      <div className="d-flex align-items-center mt-1">
                        <span className="fs-8 me-2 date">{item.date}</span>

                        <Badge
                          className="fw-normal text-capitalize"
                          color={Helper.notificationBadgeColor(
                            notifItem.template_type.toLowerCase()
                          )}
                          pill>
                          {notifItem.type}
                        </Badge>
                      </div>

                      <p className="mt-3 message">{notifItem.message}</p>
                    </div>
                  );
                })}

              {notificationList.length === 0 && !isFetching && noData}

              {hasMoreItems ? loader : null}
            </InfiniteScroll>
          </Scrollbars>
        </>
      )}
    </PrivateLayout>
  );
};

export default Notification;
