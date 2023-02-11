import { CardRecommendService, ContentWrapper } from '@components/otoklix-elements';
import WatchImpression from '@components/watch-impression/WatchImpression';
import Masonry from '@components/wrapper/Masonry';
import Helper from '@utils/Helper';
import Cookies from 'js-cookie';

const PromoDetailPackage = (props) => {
  const {
    car,
    promo,
    packages,
    productImpression,
    heightFooter,
    onClickSubtitle,
    onClickCar,
    onSetImpression,
    onPushImpression,
    onClickProduct
  } = props;

  let userCar = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

  const carName = `${car?.carName} ${car?.carModel} - ${car?.carVariant}`;

  const getSubtitle = (item) => {
    if (item?.product?.unit && item?.car_oil_qty !== null) {
      return item?.car_oil_qty + ' ' + item?.product?.unit;
    }
    return '';
  };

  const getPrice = (price, unit) => {
    const unitPrice = unit ? `/${unit}` : '';
    if (userCar === undefined && promo?.service_category === 'oli') {
      return `Rp${Helper.formatMoney(price)}${unitPrice}`;
    } else {
      return `Rp${Helper.formatMoney(price)}`;
    }
  };

  return (
    <ContentWrapper
      id="all_package"
      data-automation="promo_package"
      title="Promo yang tersedia"
      cardTitleProps={{ tag: 'h2' }}
      subtitle={
        <div>
          <img src="/assets/icons/swap.svg" className="filter-icon" alt="filter" loading="eager" />
          <span className="fw-bold mb-0 ml-05">Urutkan</span>
        </div>
      }
      subtitleClick={() => onClickSubtitle()}
      className="pe-0 px-0">
      {car?.carModel && (
        <div className="d-flex box-label">
          <span className="label-select-car">Sesuai dengan mobil:</span>
          <span className="selected-car" onClick={() => onClickCar()}>
            {Helper.truncateText(carName, 20)}
            <img
              src="/assets/icons/chevron-down-primary.svg"
              className="chevron-down-icon"
              alt="chevron-down"
              loading="lazy"
            />
          </span>
        </div>
      )}
      <Masonry column={2} gap="12px">
        {packages.map((item, index) => {
          let discount_amount;
          if (item?.discount_amount) {
            const calcDisc = +item?.discount_amount * 100;
            const finalDisc =
              parseInt(calcDisc.toFixed(0)) === parseInt(calcDisc.toFixed(1))
                ? calcDisc.toFixed(0)
                : calcDisc.toFixed(1);
            discount_amount = `${finalDisc}%`;
          } else {
            discount_amount = '';
          }

          return (
            <WatchImpression
              key={index}
              data={item}
              index={index}
              ratioPush={0}
              primaryKey={item?.package?.id}
              impressions={productImpression}
              onChange={onSetImpression}
              onPush={onPushImpression}
              useInViewOptions={{
                rootMargin: `0px 0px -${heightFooter}px 0px`,
                threshold: [0, 1]
              }}>
              <CardRecommendService
                key={index}
                className="w-100 me-3"
                title={item?.product?.name}
                subTitle={getSubtitle(item)}
                showStartPrice={true}
                startFrom={true}
                discountLabel={discount_amount}
                category={item?.product?.product_category?.name}
                startPrice={
                  item?.discount_amount > 0 ? `Rp${Helper.formatMoney(item?.price)}` : null
                }
                price={getPrice(item?.discounted_price, item?.product?.unit)}
                subPrice={
                  userCar !== undefined &&
                  item?.product?.product_category?.name === 'Oli' &&
                  item?.product?.unit
                    ? `Rp${Helper.formatMoney(item?.original_price)}/${item?.product?.unit}`
                    : null
                }
                image={item?.product?.image_link ?? '/assets/images/default-package.png'}
                imgLazyLoad={false}
                isRecommended={item?.is_car_recommendation ? 'Sesuai Mobilmu' : ''}
                onCardClick={() => onClickProduct(item)}
                showUsp={item?.product?.product_category?.name === 'Oli' && item?.product?.is_fbo}
                guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
                discountIcon={'/assets/icons/discount.svg'}
                bookmarkIcon={'/assets/icons/bookmark.svg'}
              />
            </WatchImpression>
          );
        })}
      </Masonry>
    </ContentWrapper>
  );
};

export default PromoDetailPackage;
