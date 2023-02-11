import { ContentWrapper, Row } from '@components/otoklix-elements';
import { promoSettings, servicesSettings } from '@utils/Constants';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import isUndefined from 'lodash/isUndefined';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import Slider from 'react-slick';

import AboutServices from './AboutServices';

export const ServicesFooter = (props) => {
  const { topServices } = props;
  const topServicesList = topServices?.data;
  const [serviceList, setServiceList] = useState(topServicesList);

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const handleClickItem = (item) => {
    amplitude.getInstance().logEvent('footer sitemap selected', {
      footer_keyword: item?.title,
      source_search: 'dynamic search',
      page_location: fullPath
    });

    const elm = document.getElementById('breadrumbDynamicSearch');
    elm?.scrollIntoView({ behavior: 'smooth' });
  };

  const itemService = (item, center, index) => {
    const href =
      item?.category === 'bengkel'
        ? '/bengkel'
        : item?.tag
        ? `/servis/${item.category}/${item.tag}`
        : `/servis/${item.category}`;
    return (
      <Link href={href} shallow={false} key={index} passHref>
        <a>
          <div
            className={`${center ? 'item-services-center' : 'item-services'}`}
            onClick={() => handleClickItem(item)}>
            <span className="list-services">{Helper.shortText(item.title, 21)}</span>
          </div>
        </a>
      </Link>
    );
  };

  const renderListServices = () => {
    if (+serviceList?.length > 5) {
      const totalSlider = +serviceList.length / 5;
      return (
        <Slider {...servicesSettings}>
          {[...Array(Math.ceil(totalSlider)).keys()].map((value, index) => {
            const startIndex = +index * 5;
            const endIndex = (+index + 1) * 5;
            return (
              <div data-automation={`footer_service_${index}`} className="box-list" key={index}>
                {serviceList.slice(startIndex, endIndex).map((item, index) => {
                  return itemService(item, false, index);
                })}
              </div>
            );
          })}
        </Slider>
      );
    } else {
      return (
        <div className="box-list">
          {serviceList.map((item, index) => {
            return itemService(item, true, index);
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    if (topServicesList?.length > 0) {
      const newServiceList = [
        ...topServicesList,
        {
          subject: '',
          category: 'bengkel',
          tag: null,
          title: 'Pilihan Bengkel'
        }
      ];
      setServiceList(newServiceList);
    }
  }, [topServicesList]);

  return (
    <div className={`services-footer ${+serviceList?.length <= 5 ? 'text-center' : null}`}>
      <span className="title">Top Servis Otoklix</span>
      {renderListServices()}
    </div>
  );
};

export const AboutFooter = (props) => {
  const { topServices } = props;
  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }
  const goToStore = (option) => {
    amplitude.getInstance().logEvent('download initiated', { option, page_location: fullPath });
  };

  return (
    <div className="footer bg-primary p-3 text-white">
      {!isUndefined(topServices) ? <ServicesFooter topServices={topServices} /> : ''}
      <div className="d-flex logo mt-3 justify-content-center align-items-center flex-column">
        <Link href="/servis" shallow={false} passHref>
          <a>
            <img
              src="/assets/logo/logo-white.png"
              alt="otoklix"
              width="150"
              height="42"
              className="mb-3"
              loading="lazy"
            />
          </a>
        </Link>

        <div className="img-store">
          <a
            href={`${process.env.BRANCH_LINK}Website-Install`}
            target="_blank"
            rel="noreferrer"
            onClick={() => goToStore('google play')}>
            <img
              src="/assets/images/playstore.svg"
              alt="img_playstore"
              height="35"
              width="100%"
              loading="lazy"
            />
          </a>
          <a
            href={`${process.env.BRANCH_LINK}Website-Install`}
            target="_blank"
            rel="noreferrer"
            onClick={() => goToStore('app store')}>
            <img
              src="/assets/images/appstore.svg"
              alt="img_appstore"
              height="35"
              width="100%"
              loading="lazy"
            />
          </a>
        </div>
        <div className="d-flex mb-3">
          <Link href="/account/terms-conditions">
            <span className="text-decoration-underline text-footer">Syarat & Ketentuan</span>
          </Link>
          <span className="mx-2 text-footer">|</span>
          <Link href="/account/privacy-policy">
            <span className="text-decoration-underline text-footer">Kebijakan Privasi</span>
          </Link>
        </div>
        <span className="text-copyright">©Otoklix 2022</span>
      </div>
    </div>
  );
};

export const Footer = ({ faqs, title }) => {
  return (
    <>
      <ContentWrapper
        leftPadding
        title={<h2>{title ?? 'Mengapa Booking via Otoklix'}</h2>}
        className="pe-0 px-0 otoklix-footer left-slick-container slick-footer-ptop">
        <Row className="m-0">
          <Slider {...promoSettings}>
            <div className="why-otoklix-box">
              <div className="img-box">
                <img src="/assets/images/footer-price.png" alt="img_footer_price" loading="lazy" />
              </div>
              <h3>Harga Transparan</h3>
              <p>
                Biaya servis akan ditampilkan di aplikasi sebelum ke bengkel. Sehingga tidak ada
                biaya tersembunyi.
              </p>
            </div>
            <div className="why-otoklix-box">
              <div className="img-box">
                <img
                  src="/assets/images/footer-guarantee.png"
                  alt="img_footer_guarantee"
                  loading="lazy"
                />
              </div>
              <h3>Garansi Servis 14 Hari</h3>
              <p>
                Jaminan spare part orisinal dan servis hingga 14 hari sejak pengerjaan di bengkel.
              </p>
            </div>
            <div className="why-otoklix-box">
              <div className="img-box">
                <img
                  src="/assets/images/footer-workshop.png"
                  alt="img_footer_workshop"
                  loading="lazy"
                />
              </div>
              <h3>1.000+ Bengkel Mitra se-Jabodetabek</h3>
              <p>
                Temukan bengkel terdekat di lokasi kamu melalui fitur maps dan daftar bengkel
                terlengkap di Otoklix.
              </p>
            </div>
          </Slider>
        </Row>
      </ContentWrapper>
      {!isUndefined(faqs) ? <AboutServices title="Tentang Layanan" faqs={faqs} /> : ''}
    </>
  );
};
