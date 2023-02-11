import { Container, Text } from '@components/otoklix-elements';

const CardAddressBar = ({ addressDetail, hasSparatorComponent }) => {
  return (
    <div className="card-address-bar">
      <Container className="py-3">
        <Text className="title mb-3 d-block" color="body">
          Lokasi Saya
        </Text>
        <div className="d-flex flex-row flex-nowrap mt-2 align-items-start">
          <img src="/assets/icons/location.svg" width="20" alt="location" />
          <div className="ms-2">
            {addressDetail?.label && (
              <Text tag="h2" className="text-sm fw-weight-600 mb-2 overflow-wrap-anywhere">
                {addressDetail?.label}
              </Text>
            )}
            <Text className="d-block text-xxs overflow-wrap-anywhere" color="label">
              {addressDetail?.address1 || '-'}
            </Text>
            {addressDetail?.address2 && (
              <Text className="d-block text-xxs overflow-wrap-anywhere mt-2" color="label">
                {addressDetail?.address2}
              </Text>
            )}
          </div>
        </div>
      </Container>
      {hasSparatorComponent && <div className="sparator-component" />}
    </div>
  );
};

export default CardAddressBar;
