import CardPromo from '@components/card/CardPromo';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Container, EmptyState, Header } from '@components/otoklix-elements';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

sentryBreadcrumb('pages/promo/index');

const Index = ({ promoList }) => {
  const router = useRouter();

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const goToPromoDetail = (item) => {
    gtag('click promo', 'clickPromoList', item?.name);
    console.log('item', item);

    amplitude.getInstance().logEvent('promo banner selected', {
      promo_name: item?.redirect_link || item?.name,
      promo_code: item?.promo_code,
      source_banner: 'promo list'
    });

    if (item?.redirect_link) {
      window.location.href = item?.redirect_link;
    } else if (item?.slug) {
      window.location.href = `/promo-product/${item.slug}?origin=promopage`;
    }
  };

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'promo list',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  return (
    <PrivateLayout pathName="/" wrapperClassName="wrapper-full" hasAppBar={false}>
      <Header title="Daftar Promo" onBackClick={() => router.back()} />

      <Container className="home-content">
        {promoList?.length > 0 ? (
          promoList?.map((item, index) => (
            <CardPromo
              key={index}
              imageLink={item.image_link ? item.image_link : '/assets/images/noimage.png'}
              title={item.name}
              subtitle={`Berlaku hingga ${moment(item.end_date).format('DD MMMM YYYY')}`}
              buttonTitle="Detail"
              onButtonClick={() => goToPromoDetail(item)}
            />
          ))
        ) : (
          <EmptyState image="/assets/images/voucher-lg.png" captionAsTitle={true}>
            <div className="warning-promo-message">
              Yah! Belum ada promo lagi.
              <br />
              <strong>
                Pantau terus aplikasimu agar tidak ketinggalan promo menarik selanjutnya ya.
              </strong>
            </div>
          </EmptyState>
        )}
      </Container>
    </PrivateLayout>
  );
};

export default Index;

export async function getServerSideProps({ query }) {
  const { p } = query;

  const param = p && p === '0' ? '0' : '1';

  const [promos] = await Promise.all([
    fetch(`${process.env.API_URL}v2/promo/group/product?public=${param}`)
  ]);

  const [promoData] = await Promise.all([promos.json()]);

  const promoList = promoData?.data?.promo ? promoData?.data?.promo : [];

  return {
    props: {
      promoList
    }
  };
}
