import { Icon, Text } from '@components/otoklix-elements';
import { useRouter } from 'next/router';

const PromoDetailHeader = (props) => {
  const { origin, promoName } = props;
  const router = useRouter();

  return (
    <div className="d-flex p-2 header-promo" id="coachMarkPromoStep1">
      {origin && (
        <Icon
          textRight
          imageWidth={24}
          imageHeight={24}
          size="md"
          bgIconColor="off-white"
          onClick={() => router.back()}
          className="pointer"
          iconClassName="rounded-circle"
          image="/assets/icons/arrow-left-thin.svg"
          imgAlt="icon_arrow_left"
          lazyLoad={false}
        />
      )}
      <div className="p-1"></div>
      <Text tag="span" className="d-flex align-items-center text-title fw-weight-700 fs-6 mt-2">
        {promoName}
      </Text>
    </div>
  );
};

export default PromoDetailHeader;
