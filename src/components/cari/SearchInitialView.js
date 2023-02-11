import FlagshipModal from '@components/modal/FlagshipModal';
import {
  Button,
  CardRecommendService,
  CardRecommendWorkshop,
  Container,
  Text
} from '@components/otoklix-elements';
import { trendingSettings } from '@utils/Constants';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Slider from 'react-slick';

const SearchInitialView = (props) => {
  const {
    className,
    car,
    workshops,
    services,
    lastSearch,
    popularSearch,
    onClickKeyword,
    onClickService
  } = props;

  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');

  const router = useRouter();

  const getPrice = (item) => {
    if (!car) {
      return item?.product_unit
        ? `Rp${Helper.formatMoney(item.price)}/${item?.product_unit}`
        : `Rp${Helper.formatMoney(item?.price)}`;
    } else {
      return `Rp${Helper.formatMoney(item?.price)}`;
    }
  };

  const trackOnClickRecommendation = (type, name) => {
    amplitude.getInstance().logEvent('recommendation selected', {
      recommendation_type: type,
      recommendation_name: name,
      recommendation_location: 'search page',
      is_fulfilled_by_otoklix: true
    });
  };

  const trackOnClickKeyword = (keyword, type) => {
    amplitude.getInstance().logEvent('search suggestion selected', {
      searched_keyword: keyword,
      suggestion_type: type
    });
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  return (
    <Container className={className}>
      {lastSearch && lastSearch.length > 0 && (
        <div className="search-page__last-search">
          <Text className="text-md" weight="semi-bold">
            Pencarian Terakhir
          </Text>
          <div className="mt-2">
            {lastSearch.map((item, index) => (
              <Button
                data-automation={`search-history-search${index}`}
                size="sm"
                color="subtle"
                className="my-1 me-2 text-truncate"
                key={`last-search-${index}`}
                onClick={() => {
                  onClickKeyword(item?.keyword);
                  trackOnClickKeyword(item?.keyword, 'history');
                }}>
                {item?.keyword}
              </Button>
            ))}
          </div>
        </div>
      )}

      {workshops && workshops.length > 0 && (
        <div className="mt-3">
          <Text className="text-md" weight="semi-bold">
            Rekomendasi Bengkel Pilihan
          </Text>
          <Slider {...trendingSettings}>
            {workshops.map((item, index) => (
              <div
                className="mt-2 search-page__items-recommendation"
                key={`workshop-recommendation-${index}`}>
                <CardRecommendWorkshop
                  data-automation={`search-card-workshop-recommendation-${index}`}
                  title={item?.name}
                  image={item?.image_link ?? '/assets/images/default-package.png'}
                  rating={item?.rating}
                  reviewTotal={item?.total_review}
                  address={item?.district?.name}
                  distance={item?.distance}
                  priceLevel={null}
                  eta={null}
                  workshopIndex={index}
                  onCardClick={() => {
                    router.push({ pathname: `/bengkel/${item?.slug}` });
                    trackOnClickRecommendation('workshop', item?.name);
                  }}
                  dataAutomationRating={`search_recommend_workshop_rating_${index}`}
                  dataAutomationReview={`search_recommend_workshop_review_${index}`}
                  dataAutomationName={`search_recommend_workshop_name_${index}`}
                  dataAutomationAddress={`search_recommend_workshop_address_${index}`}
                  dataAutomationDistance={`search_recommend_workshop_distance_${index}`}
                  showFlagship={item?.tier?.name?.includes('Flagship')}
                  flagshipIcon={`/assets/icons/${
                    item?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
                  }.svg`}
                  dataAutomationFlagship={`search_recommend_workshop_flagship_${index}`}
                  isFlagshipPlus={item?.tier?.name?.toLowerCase() === 'flagship plus'}
                  flagshipDetailTarget={() => handleOpenPopUp(item?.tier?.name)}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {services && services.length > 0 && (
        <div className="mt-3">
          <Text className="text-md" weight="semi-bold">
            Servis Rekomendasi
          </Text>
          <Slider {...trendingSettings}>
            {services.map((item, index) => (
              <div
                className="mt-2 search-page__items-recommendation"
                key={`service-recommendation-${index}`}>
                <CardRecommendService
                  data-automation={`search-service-recommendation-${index}`}
                  pageLocation="cari"
                  cardIndex={index}
                  className="me-2"
                  title={item?.name}
                  image={item?.image_link}
                  showStartPrice={true}
                  startFrom={true}
                  startPrice={
                    item?.discount_value > 0
                      ? `Rp${Helper.formatMoney(item?.original_price)}`
                      : null
                  }
                  price={getPrice(item)}
                  subPrice={
                    car && item?.category.slug === 'oli' && item?.product_unit
                      ? `Rp${Helper.formatMoney(item.product_price)}/${item.product_unit}`
                      : null
                  }
                  category={item?.category?.name}
                  discountLabel={item?.discount_value > 0 ? `${item?.discount_value}%` : null}
                  onCardClick={() => {
                    onClickService(item);
                    trackOnClickRecommendation('product', item?.name);
                  }}
                  // Test 'True' Value
                  isRecommended={Helper.labelRecommend(item?.compatibility)}
                  showUsp={item?.category?.slug === 'oli' && item?.is_fbo}
                  guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
                  discountIcon={'/assets/icons/discount.svg'}
                  bookmarkIcon={'/assets/icons/bookmark.svg'}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {popularSearch && popularSearch.length > 0 && (
        <div className="mt-3 search-page__last-search">
          <Text className="text-md" weight="semi-bold">
            Pencarian Populer
          </Text>
          <div className="mt-2">
            {popularSearch.map((item, index) => (
              <Button
                data-automation={`search-popular-search-${index}`}
                size="sm"
                color="subtle"
                className="my-1 me-2 text-truncate"
                key={`last-search-${index}`}
                onClick={() => {
                  onClickKeyword(item?.keyword);
                  trackOnClickKeyword(item?.keyword, 'popular');
                }}>
                {item?.keyword}
              </Button>
            ))}
          </div>
        </div>
      )}

      <FlagshipModal
        showFlagshipModal={showPopupInfo}
        closeFlagshipModal={() => setShowPopupInfo(false)}
        tier={tier}
      />
    </Container>
  );
};

export default SearchInitialView;
