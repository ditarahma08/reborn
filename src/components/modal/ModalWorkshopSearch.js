import CardPromo from '@components/card/CardPromo';
import InputSearch from '@components/input/InputSearch';
import SearchListItem from '@components/list/SearchListItem';
import {
  ContentWrapper,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Tags
} from '@components/otoklix-elements';
import { api } from '@utils/API';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import ScrollMenu from 'react-horizontal-scrolling-menu';

const ModalWorkshopSearch = ({ toggle, setToggle }) => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('Mulai cari bengkel atau promo');
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const { workshops, packages, promos } = data;

  async function getFilters() {
    const response = await api.get('v2/search/filter/');
    setFilters(response.data.data);

    if (response.data.data.length > 0) {
      setActiveFilter(response.data.data[0].value);
    }
  }

  async function searchWorkshop(q, filter) {
    setIsFetching(true);

    const response = await api.get(`v2/search/?q=${q}&filter_search=${filter}`);
    setData(response.data.data);

    if (
      isEmpty(response.data.data.workshops) &&
      isEmpty(response.data.data.packages) &&
      isEmpty(response.data.data.promos)
    ) {
      setMessage('Tidak ada data yang ditemukan');
    } else {
      setMessage(null);
    }

    setIsFetching(false);
  }

  const handler = useCallback(
    debounce((e, filter) => {
      if (e.length > 0) {
        searchWorkshop(e, filter);
      } else {
        setMessage('Mulai cari bengkel atau promo');
        setData([]);
      }
    }, 500),
    []
  );

  const onChange = (e) => {
    let q = e.target.value;

    setQuery(q);
    handler(q, activeFilter);
  };

  const changeActiveFilter = (value) => {
    gtag('click filter', 'clickSearchPage', value);

    setActiveFilter(value);
    if (query.length > 0) {
      setIsFetching(true);
      handler(query, value);
    }
  };

  const goToWorkshopPage = (workshop) => {
    gtag('click workshop', 'clickSearchPage', workshop.name);

    let query = {
      origin: 'Global Search'
    };

    router.push({ pathname: `/bengkel/${workshop.slug}`, query: query });
  };

  const goToPromoPage = (item) => {
    gtag('click promo', 'clickSearchPage', item?.name);

    router.push(`/promo/${item.slug}`);
  };

  const goToServicePage = (item) => {
    gtag('click sku', 'clickSearchPage', item?.name);

    item.workshop_slug
      ? router.push({
          pathname: `/bengkel/${item.workshop_slug}`,
          query: {
            service_category: item?.category?.slug,
            package_id: item.id
          }
        })
      : setToggle(false);
  };

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <Modal
      isOpen={toggle}
      className="wrapper wrapper-xs modal-find-workshop"
      toggle={setToggle}
      backdrop={false}
      onOpened={() => gtag('view search', 'viewSearchPage')}
      keyboard={false}>
      <ModalHeader className="box-shadow-modal-header">
        <div className="d-flex flex-row pointer mb-3">
          <div className="me-2" role="presentation" onClick={setToggle}>
            <img src="/assets/icons/back.svg" alt="" />
          </div>
          <div className="w-100">
            <InputSearch
              value={query}
              onChange={onChange}
              onClick={() => gtag('click input search', 'clickSearchPage')}
            />
          </div>
        </div>

        <div className="quick-filter">
          <ScrollMenu
            alignCenter={false}
            data={filters.map((filter) => {
              return (
                <Tags
                  key={filter.value}
                  onClick={() => changeActiveFilter(filter.value)}
                  className="tags"
                  active={filter.value === activeFilter}
                  size="md"
                  color="input-bg"
                  textColor="label"
                  title={filter.name}
                />
              );
            })}
          />
        </div>
      </ModalHeader>

      <ModalBody>
        <Scrollbars autoHide universal={true} autoHeight autoHeightMin={'calc(100vh - 168px)'}>
          {isFetching ? (
            <div className="d-flex justify-content-center p-3">
              <Spinner color="primary" />
            </div>
          ) : (
            <React.Fragment>
              {message && (
                <div className="d-flex justify-content-center text-center p-3">{message}</div>
              )}

              {workshops?.length > 0 ? (
                <ContentWrapper title="Bengkel" classNameTitle="fw-bold">
                  {workshops?.map((workshop) => {
                    return (
                      <SearchListItem
                        key={workshop.slug}
                        rating={workshop.rating}
                        distance={workshop.estimated_distance}
                        title={workshop.name}
                        imageLeft={
                          workshop?.image_link ? workshop?.image_link : '/assets/images/noimage.png'
                        }
                        subtitle={workshop.kecamatan}
                        onClick={() => goToWorkshopPage(workshop)}
                      />
                    );
                  })}
                </ContentWrapper>
              ) : null}

              {packages?.length > 0 ? (
                <ContentWrapper title="Service/Paket" classNameTitle="fw-bold">
                  {packages?.map((item) => {
                    return (
                      <SearchListItem
                        key={item.name}
                        title={Helper.shortenName(item?.name)}
                        imageLeft={
                          item?.image_link ? item?.image_link : '/assets/images/noimage.png'
                        }
                        subtitle={Helper.toRupiahRange(item?.estimated_price)}
                        subtitleClassName="text-secondary"
                        onClick={() => goToServicePage(item)}
                      />
                    );
                  })}
                </ContentWrapper>
              ) : null}

              {promos?.length > 0 ? (
                <ContentWrapper title="Promo" classNameTitle="fw-bold">
                  {promos?.map((item) => {
                    return (
                      <CardPromo
                        key={item.name}
                        imageLink={
                          item?.image_link ? item?.image_link : '/assets/images/noimage.png'
                        }
                        title={item.name}
                        subtitle={`Berlaku hingga ${moment(item.end_date).format('DD MMMM YYYY')}`}
                        buttonTitle="Detail"
                        onButtonClick={() => goToPromoPage(item)}
                      />
                    );
                  })}
                </ContentWrapper>
              ) : null}
            </React.Fragment>
          )}
        </Scrollbars>
      </ModalBody>
    </Modal>
  );
};

export default ModalWorkshopSearch;
