import { Button, CardRecommendService, ContentWrapper } from '@components/otoklix-elements';
import WatchImpression from '@components/watch-impression/WatchImpression';
import Helper from '@utils/Helper';
import isUndefined from 'lodash/isUndefined';
import dynamic from 'next/dynamic';

const Skeleton = dynamic(() => import('@components/skeleton/Skeleton'));
const Masonry = dynamic(() => import('@components/wrapper/Masonry'));

const ServicePackageList = (props) => {
  const {
    userCar,
    packageList,
    heightHeader,
    heightFooter,
    widthBlocker,
    showMoreButton,
    productImpression,
    loadPackage,
    onChangeProduct,
    onPushProduct,
    onClickCard,
    onAddPackage
  } = props;

  const getSubtitle = (item) => {
    if (item?.product_unit && item?.product_quantity !== null) {
      return item?.product_quantity + ' ' + item?.product_unit;
    }
    return '';
  };

  const getPrice = (price, unit) => {
    let finalPrice;
    if (!isUndefined(userCar?.car_details?.id)) {
      finalPrice = `${Helper.formatMoney(price)}`;
    } else {
      finalPrice = `${Helper.formatMoney(price)} ${unit !== null ? `/${unit}` : ''}`;
    }
    return `Rp${finalPrice}`;
  };

  const getSubprice = (item) => {
    if (!isUndefined(userCar?.car_details?.id) && item?.category?.slug === 'oli') {
      return `Rp${Helper.formatMoney(item?.product_price)}/${item?.product_unit}`;
    } else {
      return null;
    }
  };

  return (
    <ContentWrapper
      title="Rekomendasi Servis buat Kamu"
      className="mt-2 mb-4 px-2"
      classNameTitle="title-container"
      cardTitleProps={{ tag: 'h2' }}>
      <Masonry column={2} gap="12px">
        {packageList.length > 0
          ? packageList.map((item, index) => {
              const hasDiscount = item?.discount_value > 0;
              return (
                <WatchImpression
                  key={index}
                  data={item}
                  index={index}
                  ratioPush={0}
                  primaryKey={item?.id}
                  impressions={productImpression}
                  onChange={onChangeProduct}
                  onPush={onPushProduct}
                  useInViewOptions={{
                    rootMargin: `-${heightHeader}px 0px -${heightFooter}px ${widthBlocker}`,
                    threshold: [0, 1]
                  }}>
                  <CardRecommendService
                    key={index}
                    className="w-100"
                    title={item?.name}
                    subTitle={getSubtitle(item)}
                    discountLabel={hasDiscount ? `${item.discount_value}%` : ''}
                    category={item?.category?.name}
                    startPrice={
                      hasDiscount ? `Rp${Helper.formatMoney(item?.original_price)}` : null
                    }
                    price={getPrice(item?.price, item?.product_unit)}
                    subPrice={getSubprice(item)}
                    image={item?.image_link ?? '/assets/images/default-package.png'}
                    isRecommended={Helper.labelRecommend(item?.compatibility)}
                    onCardClick={() => onClickCard(item, index)}
                    showUsp={item?.category?.slug === 'oli' && item?.is_fbo}
                    guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
                    discountIcon={'/assets/icons/discount.svg'}
                    bookmarkIcon={'/assets/icons/bookmark.svg'}
                  />
                </WatchImpression>
              );
            })
          : [...Array(4).keys()].map((value) => (
              <Skeleton width="100%" height={270} className="br-1 mb-0" key={value} />
            ))}
      </Masonry>
      {showMoreButton && (
        <Button
          block
          outline
          className="text-md mt-3 br-30"
          color="primary"
          onClick={() => onAddPackage()}
          disabled={loadPackage}
          loading={loadPackage}>
          Tampilkan Lebih Banyak
        </Button>
      )}
    </ContentWrapper>
  );
};

export default ServicePackageList;
