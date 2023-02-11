import { Card, Text } from '@components/otoklix-elements';

const LocationCard = ({ address, handleOnClick }) => {
  return (
    <div className="pt-3">
      <Card
        className="rounded-1-half p-3 pointer"
        data-automation="location_card_button"
        onClick={handleOnClick}>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <img src="/assets/icons/location-orange-gradient.svg" alt="location" />
            <div className="ms-3" data-automation="location_card_address_detail">
              <Text
                color={address?.label && address?.address1 ? 'secondary' : 'label'}
                className={`mt-auto d-block text-truncate add-address__address-label ${
                  address?.label && address?.address1 ? 'text-xs fw-bold' : 'text-xxs'
                }`}>
                {address?.address1 ? address?.label || '' : 'Atur Lokasi Penjemputan Mobilmu'}
              </Text>
              <Text
                color={address?.address1 ? 'label' : 'secondary'}
                className={`mt-auto d-block text-truncate add-address__address-label ${
                  address?.address1 ? 'text-xxs' : 'text-xxs fw-bold'
                }`}>
                {address?.address1 || 'Masukkan Alamat Kamu, yuk!'}
              </Text>
            </div>
          </div>
          <img src="/assets/icons/right-chevron-dark-grey.svg" alt="chevron-right" />
        </div>
      </Card>
    </div>
  );
};

export default LocationCard;
