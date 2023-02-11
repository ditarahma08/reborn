import { Container, Input, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

const ReasonListBottomsheet = (props) => {
  const { open, reasonList, onDismiss, onChangeReason, reason } = props;
  const [selectedReason, setSelectedReason] = useState(null);

  const handleChangeReason = (event) => {
    const value = event.target.value;
    setSelectedReason(value);
    onChangeReason(value);
  };

  useEffect(() => {
    setSelectedReason(reason.id);
  }, [reason]);

  return (
    <BottomSheet open={open} skipInitialTransition scrollLocking={false} onDismiss={onDismiss}>
      <Container className="p-3 mb-3">
        <Text weight="bold">Alasan Refund</Text>
        {reasonList?.map((item, index) => (
          <Container
            className="d-flex justify-content-between mt-3"
            key={`${item?.value}-${index}`}>
            <Text
              color="label"
              weight="bold"
              className="text-xs"
              data-automation={`refund_alasan_refund_${index}`}>
              {item?.value}
            </Text>
            <Input
              type="radio"
              value={item?.id}
              className="input-radio shadow-none-radio refund-bank__radio-options ms-2"
              checked={selectedReason === item?.id}
              onChange={handleChangeReason}
            />
          </Container>
        ))}
      </Container>
    </BottomSheet>
  );
};

export default ReasonListBottomsheet;
