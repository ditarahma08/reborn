import ChangeDefaultAddress from '@components/add-address/ChangeDefaultAddress';
import { Button, Card, CardBody, Icon, Tags, Text } from '@components/otoklix-elements';
import { useState } from 'react';

const AddressCard = (props) => {
  const {
    onCardClick,
    label,
    address,
    onClickEditAddress,
    isDefault,
    temporaryAddress,
    handleDeleteAddress,
    handleChangeAddress,
    id,
    addressDetail
  } = props;

  const [openSheet, setOpenSheet] = useState(false);

  const handleKebabMenu = () => {
    setOpenSheet(!openSheet);
  };

  const changeAddress = () => {
    handleKebabMenu();
    handleChangeAddress(id);
  };

  const deleteAddress = () => {
    handleKebabMenu();
    handleDeleteAddress(id);
  };

  return (
    <>
      <Card className="border-0 xs-card-shadow mb-3">
        <CardBody>
          <div
            className="d-flex justify-content-between align-items-start mb-4 pointer"
            onClick={onCardClick}>
            <div className="d-flex justify-content-start align-items-start me-2">
              <img
                src="/assets/icons/pin-map-grey.svg"
                width="22"
                alt="location"
                className="me-2"
              />
              <div className="align-items-start">
                <div className="d-flex align-items-start mb-3">
                  <Text color="primary" className="d-block text-md fw-bold overflow-wrap-anywhere">
                    {label || '-'}
                  </Text>
                  {isDefault && (
                    <Tags
                      pill
                      className="ms-2 fit-content-tag"
                      color="primary"
                      size="sm"
                      tag="span"
                      title="Utama"
                    />
                  )}
                </div>
                <Text color="label" className="mt-auto d-block text-xxs overflow-wrap-anywhere">
                  {address || '-'}
                </Text>
                {addressDetail && (
                  <Text color="label" className="mt-2 d-block text-xxs overflow-wrap-anywhere">
                    {addressDetail}
                  </Text>
                )}
              </div>
            </div>
            <img
              src={`/assets/icons/${temporaryAddress ? 'radio_active.svg' : 'radio_inactive.svg'}`}
              width="28"
              alt="active"
            />
          </div>
          <div className="d-flex justify-align-center">
            {!isDefault && (
              <Icon
                data-automation="order_list_button_menu"
                card
                textRight
                image="/assets/icons/blue-kebab.svg"
                imageHeight={24}
                imageWidth={24}
                className="pointer bg-kebab px-2 rounded-icon-button blue-border me-3"
                onClick={handleKebabMenu}
              />
            )}
            <Button
              size="xs"
              data-automation="change_address_button"
              block
              onClick={() => onClickEditAddress(id)}>
              Ubah Alamat
            </Button>
          </div>
        </CardBody>
      </Card>
      <ChangeDefaultAddress
        open={openSheet}
        onClose={handleKebabMenu}
        handleChangeAddress={changeAddress}
        handleDeleteAddress={deleteAddress}
      />
    </>
  );
};

export default AddressCard;
