import { Button, Card, Input, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';

const AddressViewInput = ({ location, fullPath, onConfirm, onTrack, isEdit }) => {
  const [addressLabel, setAddressLabel] = useState('');
  const [addressLabelChar, setAddressLabelChar] = useState(0);
  const [addressDetail, setAddressDetail] = useState('');
  const [addressDetailChar, setAddressDetailChar] = useState(0);

  const handleAddressLabel = (event) => {
    const { value } = event.target;
    setAddressLabel(value);
    setAddressLabelChar(value.length);
  };

  const handleAddressDetail = (event) => {
    const { value } = event.target;
    setAddressDetail(value);
    setAddressDetailChar(value.length);
  };

  const handleAddAddress = () => {
    onTrack('form submitted', {
      cta_location: 'bottom',
      form_name: 'manual user address form',
      page_location: fullPath
    });

    onConfirm({ ...location, label: addressLabel, detail: addressDetail });
  };

  const handleEditValue = () => {
    setAddressLabel(location?.label);
    setAddressDetail(location?.detail);
    console.log(location);
  };

  useEffect(() => {
    onTrack('screen viewed', {
      screen_name: 'address detail',
      screen_category: 'browse',
      page_location: fullPath
    });

    if (isEdit) {
      handleEditValue();
    }
  }, []);

  return (
    <>
      <div className="mx-3">
        <Card className="card-vehicle border-7 flex-row py-3">
          <img
            className="me-3"
            src="/assets/icons/location-grey.svg"
            height="18"
            width="18"
            alt="location-grey"
            loading="lazy"
          />
          <Text color="dark" className="text-xxs">
            {location?.address}
          </Text>
        </Card>

        <div className="mb-3 mt-4">
          <Text weight="semi-bold" className="text-sm">
            Label Alamat
          </Text>
          <Input
            data-automation="add_address_label"
            size="sm"
            className="border-7"
            placeholder="Rumah"
            maxLength={30}
            value={addressLabel}
            onChange={handleAddressLabel}
          />
          <div className="d-flex justify-content-end me-1 mt-1">
            <Text color="dark" className="text-xs text-right">
              {addressLabelChar}/30
            </Text>
          </div>
        </div>

        <div>
          <Text weight="semi-bold" className="text-sm">
            Alamat Detail
          </Text>
          <Input
            data-automation="add_address_detail"
            size="sm"
            className="border-7"
            placeholder="Tambahkan detail alamat"
            type="textarea"
            maxLength={200}
            value={addressDetail}
            onChange={handleAddressDetail}
          />
          <div className="d-flex justify-content-end me-1 mt-1">
            <Text color="dark" className="text-xs">
              {addressDetailChar}/200
            </Text>
          </div>
        </div>
      </div>

      <div className="add-address__address-footer d-flex flex-column p-3">
        <Text color="dark" className="text-xxs text-center mb-3">
          Dengan menambahkan alamat ini otomatis akan menjadi alamat utama
        </Text>
        <Button data-automation="add_address_button_save" onClick={handleAddAddress}>
          Simpan
        </Button>
      </div>
    </>
  );
};

export default AddressViewInput;
