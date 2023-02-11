import PrivateLayout from '@components/layouts/PrivateLayout';
import { CardImg, Container, EmptyState, Header } from '@components/otoklix-elements';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

sentryBreadcrumb('pages/promo/index');

const Index = ({ promoGroup, promoParam }) => {
  const router = useRouter();

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const param = promoParam === '0' ? '0' : '1';

  const goToPromoDetail = (item) => {
    amplitude.getInstance().logEvent('promo group selected', {
      promo_group_name: item?.name,
      page_location: fullPath
    });

    router.push({
      pathname: `/promo/${item.slug}`,
      query: {
        p: param
      }
    });
  };

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'promo group',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  return (
    <PrivateLayout
      pathName="/"
      wrapperClassName="wrapper-full"
      title={Helper.exploreMetaTags('promo')?.title}
      description={Helper.exploreMetaTags('promo')?.desc}>
      <Header title="Promo Menarik Buat Kamu" onBackClick={() => router.back()} />

      <Container className="home-content">
        {promoGroup.length > 0 ? (
          promoGroup.map((item, index) => (
            <Link key={index} href={`/promo/${item.slug}?p=${param}`} passHref>
              <a href={`/promo/${item.slug}?p=${param}`}>
                <CardImg
                  width="100%"
                  className="mb-3 promo-group pointer"
                  src={item.image_link ? item.image_link : '/assets/images/noimage.png'}
                  onClick={() => goToPromoDetail(item)}
                />
              </a>
            </Link>
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

  const promoParam = p && p === '0' ? '0' : '1';

  const [promoList] = await Promise.all([
    fetch(`${process.env.API_URL}v2/promo/group?public=${promoParam}`)
  ]);

  const [promoData] = await Promise.all([promoList.json()]);

  const promoGroup = promoData?.data?.promo_group ? promoData?.data?.promo_group : [];

  return {
    props: {
      promoGroup,
      promoParam
    }
  };
}
