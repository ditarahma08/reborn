import { Card, FormGroup, Input, Label, Text } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { useEffect, useState } from 'react';

const InputSelect = ({
  packages,
  setAddOnPrice,
  setSelectedPackages,
  fromCheckout = false,
  addOnRef,
  amplitudeValue,
  workshopName,
  productName,
  disabled
}) => {
  const [checked, setChecked] = useState(addOnRef.current?.id);

  const handleChangeInput = (id, price, name) => {
    addOnRef.current = { id, price, name };
    setChecked(id);
    setAddOnPrice(price);
    setSelectedPackages(id);

    amplitude.getInstance().logEvent('product added to cart', {
      ...amplitudeValue,
      product_name: name,
      source_list: 'add-on product',
      workshop_name: workshopName
    });
  };

  const resetSelectedInput = () => {
    if (!disabled) {
      addOnRef.current = {};
      setChecked();
      setAddOnPrice(0);
      setSelectedPackages();

      amplitude.getInstance().logEvent('product added to cart', {
        ...amplitudeValue,
        product_name: productName,
        source_list: 'default product',
        workshop_name: workshopName
      });
    }
  };

  useEffect(() => {
    if (fromCheckout) {
      const selectedPackage = packages?.find((item) => item?.is_selected === true)?.id;
      const addOnPrice = packages?.find((item) => item?.is_selected === true)?.price;
      const addOnName = packages?.find((item) => item?.is_selected === true)?.name;

      setChecked(selectedPackage);
      setAddOnPrice(addOnPrice ?? 0);
      selectedPackage && setSelectedPackages(selectedPackage);
      addOnRef.current = { id: selectedPackage, price: addOnPrice, name: addOnName };
    }
  }, [fromCheckout]);

  return (
    <>
      <div className="d-flex justify-content-between">
        <Text className="title" tag="span" color="body">
          Mungkin Juga Butuh
        </Text>
        {checked !== undefined && (
          <Text
            className="text-xs pointer fw-weight-600"
            tag="span"
            color="primary"
            data-automation="order_confirmation_reset_button"
            onClick={resetSelectedInput}>
            Reset
          </Text>
        )}
      </div>

      <div className="my-2 order-select">
        {packages?.map((item, index) => {
          if (index >= 0) {
            return (
              <Card
                className="p-3 mb-3 d-flex flex-row justify-content-between align-items-center border-7"
                key={index}>
                <Text className="text-md fw-weight-600">{item?.name}</Text>
                <FormGroup className="ms-auto d-flex align-items-center" check>
                  <Label className="d-flex align-items-center" check>
                    <div className="d-flex flex-column align-items-end">
                      {item?.is_discount && (
                        <Text
                          className="text-xxs text-price-discount text-decoration-line-through"
                          color="light">
                          {`Rp${Helper.formatMoney(item?.original_price)}`}
                        </Text>
                      )}
                      <Text className="text-xs text-price fw-weight-600" color="secondary">
                        {`Rp${Helper.formatMoney(item?.price)}`}
                      </Text>
                    </div>
                    <Input
                      className="input-radio mt-0 ms-3"
                      type="radio"
                      name="selectPackage"
                      value={item?.id}
                      checked={checked === item?.id}
                      data-automation={`order_confirmation_addon_input_${index}`}
                      onChange={() => handleChangeInput(item?.id, item?.price, item?.name)}
                      disabled={disabled}
                    />
                  </Label>
                </FormGroup>
              </Card>
            );
          }
        })}
      </div>
    </>
  );
};

export default InputSelect;
