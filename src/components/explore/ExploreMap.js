import ButtonPromoSmall from '@components/button/ButtonPromoSmall';
import PinMap from '@components/map/PinMap';
import PinSelectedMap from '@components/map/PinSelectedMap';
import PinShop from '@components/map/PinShop';
import { CardWorkshopsSlide, Text } from '@components/otoklix-elements';
import WatchImpression from '@components/watch-impression/WatchImpression';
import { gmapConfig } from '@utils/Constants';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import GoogleMapReact from 'google-map-react';
import filter from 'lodash/filter';
import { useRef, useState } from 'react';
import Slider from 'react-slick';

const GMAP_KEY = process.env.GMAP;

const ExploreMap = (props) => {
  const {
    promo,
    mapCenter,
    workshops,
    serviceActive,
    geoLocation,
    onMapCenterChange,
    resetLocation,
    userCar,
    onHighlightWorkshop,
    loadMoreWorkshops,
    openWorkshop,
    isTracking,
    heightOfHeader,
    heightOfFooter,
    workshopImpression,
    onChangeImpression,
    onPushImpression
  } = props;

  const exploreMapSlider = useRef(null);

  const [mapZoom, setMapZoom] = useState(15);
  const [marker, setMarker] = useState(null);

  const exploreMapListSettings = {
    arrows: false,
    dots: false,
    infinite: false,
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    className: 'slider variable-width',
    afterChange: (current) => highlightWorkshop(current)
  };

  const setupCoord = () => {
    let locations = [];

    workshops.forEach((value) => {
      locations.push({
        lat: Number(value.latitude),
        lng: Number(value.longitude),
        text: value.name,
        hash: value
      });
    });

    return locations;
  };

  const coord = setupCoord();

  const onBoundsChange = ({ zoom }) => {
    setMapZoom(zoom);
  };

  const handleClickMap = (e) => {
    gtag('click maps', 'clickExploreMaps');
    GtmEvents.gtmMapsInteractionExplore(geoLocation?.address ?? '');

    setMarker(e);
    onMapCenterChange(e);
  };

  const handlePinClick = (data) => {
    if (coord) {
      if (coord[data]?.hash) {
        exploreMapSlider.current.slickGoTo(parseInt(data));
      }
    }
  };

  const highlightWorkshop = (data) => {
    if (coord) {
      if (coord[data]?.hash) {
        const workshop = coord[data]?.hash;
        onHighlightWorkshop({ lat: workshop?.latitude, lng: workshop?.longitude });

        if (data + 1 === workshops?.length) {
          loadMoreWorkshops();
        }
      }
    }
  };

  const getMinPrice = (item) => {
    const services = item?.service_categories;
    const active = filter(services, (service) => {
      return service?.value === serviceActive;
    });

    return active[0]?.minimum_price;
  };

  const workshopPrice = (workshop) => {
    return (
      <div className="mt-2">
        <Text color="label" className="text-xxs">
          Mulai Dari{' '}
        </Text>
        <Text color="secondary" weight="bold" className="text-xs">
          {userCar?.carId
            ? `Rp${Helper.formatMoney(getMinPrice(workshop))}`
            : `Rp${Helper.maskPrice(getMinPrice(workshop))}`}
        </Text>
      </div>
    );
  };

  const handleChangeWorkshopImpression = (impressionList) => {
    onChangeImpression(impressionList);
  };

  const handlePushWorkshopImpression = (impressionList) => {
    onPushImpression(impressionList);
  };

  return (
    <>
      <GoogleMapReact
        options={gmapConfig}
        bootstrapURLKeys={{ key: GMAP_KEY }}
        center={mapCenter}
        onChange={onBoundsChange}
        onClick={(e) => handleClickMap(e)}
        onChildClick={(e) => handlePinClick(e)}
        defaultZoom={15}
        zoom={mapZoom}>
        <PinMap {...geoLocation} text={'Current Location'} />

        {coord.map((value, index) => {
          return <PinShop key={index} lat={value.lat} lng={value.lng} text={value.text} />;
        })}

        {marker && <PinSelectedMap {...marker} />}
      </GoogleMapReact>

      <div className="explore-map__list-box">
        <div
          className={`d-flex align-items-center ${
            promo ? 'justify-content-between' : 'justify-content-end'
          }`}>
          {promo && (
            <div className={`current-promo-box ms-2 ${marker ? 'marker' : ''}`}>
              <ButtonPromoSmall
                className="btn-floating rounded-pill"
                rightImage="/assets/images/voucher-lg.png"
                promoCode={promo}
              />
            </div>
          )}

          <div
            className="explore-map__current-location m-2 mb-3 pointer"
            onClick={() => {
              setMarker(null);
              resetLocation();
            }}
            role="presentation">
            <img src="/assets/icons/current-location.svg" alt="" />
          </div>
        </div>

        {!isTracking && (
          <Slider ref={exploreMapSlider} {...exploreMapListSettings}>
            {workshops?.map((item, index) => (
              <CardWorkshopsSlide
                key={`${item?.slug}-${index}`}
                title={item?.name}
                image={item?.image_link}
                timeArrival={`${item?.eta} menit`}
                distance={`${item?.distance}km`}
                rating={item?.rating}
                ratingImage="/assets/icons/star-orange.svg"
                buttonLabel="Cek Bengkel"
                className="explore-map__card-workshop ms-2 p-1"
                onButtonClick={() => openWorkshop(item, index)}
                pricing={
                  item?.tier?.value === 'non_verified' ? (
                    <div className="mt-2">
                      <Text color="placeholder" weight="bold" className="text-xs">
                        Tidak Tersedia
                      </Text>
                    </div>
                  ) : (
                    workshopPrice(item)
                  )
                }
              />
            ))}
          </Slider>
        )}

        {isTracking && (
          <Slider ref={exploreMapSlider} {...exploreMapListSettings}>
            {workshops?.map((item, index) => (
              <WatchImpression
                key={index}
                data={item}
                index={index}
                ratioPush={0}
                primaryKey={item?.slug}
                impressions={workshopImpression}
                onChange={handleChangeWorkshopImpression}
                onPush={handlePushWorkshopImpression}
                useInViewOptions={{
                  rootMargin: `-${heightOfHeader}px 0px -${heightOfFooter}px 0px`,
                  threshold: [0, 1]
                }}>
                <CardWorkshopsSlide
                  key={`${item?.slug}-${index}`}
                  title={item?.name}
                  image={item?.image_link}
                  timeArrival={`${item?.eta} menit`}
                  distance={`${item?.distance}km`}
                  rating={item?.rating}
                  ratingImage="/assets/icons/star-orange.svg"
                  buttonLabel="Cek Bengkel"
                  className="explore-map__card-workshop ms-2 p-1"
                  onButtonClick={() => openWorkshop(item, index)}
                  pricing={
                    item?.tier?.value === 'non_verified' ? (
                      <div className="mt-2">
                        <Text color="placeholder" weight="bold" className="text-xs">
                          Tidak Tersedia
                        </Text>
                      </div>
                    ) : (
                      workshopPrice(item)
                    )
                  }
                />
              </WatchImpression>
            ))}
          </Slider>
        )}
      </div>
    </>
  );
};

export default ExploreMap;
