import { Card, Icon, Text } from '@components/otoklix-elements';
import ReasonListBottomsheet from '@components/refund/ReasonListBottomsheet';
import { api } from '@utils/API';
import { useEffect, useState } from 'react';

const ReasonSection = ({ onChange }) => {
  const [openReasonList, setOpenReasonList] = useState(false);
  const [reasonList, setReasonList] = useState([]);
  const [activeReason, setActiveReason] = useState({});
  const [activeReasonLabel, setActiveReasonLabel] = useState('Alasan Refund');

  const handleChangeReason = (selectedReason) => {
    const reasonSelected = reasonList?.find((reason) => reason?.id == selectedReason);
    setActiveReason(reasonSelected);
    setOpenReasonList(!openReasonList);
    setActiveReasonLabel(reasonSelected?.value);
    onChange(reasonSelected?.value);
  };

  const fetchReasons = async () => {
    try {
      const response = await api.get('/v2/refund/reasons/');
      setReasonList(response?.data?.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  return (
    <Card className="border-0 py-2">
      <div
        className="d-flex justify-content-between align-items-center pointer"
        onClick={() => setOpenReasonList(!openReasonList)}
        data-automation="refund_button_alasan_refund">
        <Text
          color="label"
          className={`reason ${activeReasonLabel !== 'Alasan Refund' && 'filled'}`}>
          {activeReasonLabel}
        </Text>
        <Icon card image="/assets/icons/arrow-down-gray.svg" imageHeight={15} imageWidth={15} />
        <ReasonListBottomsheet
          open={openReasonList}
          reasonList={reasonList}
          reason={activeReason}
          onDismiss={() => setOpenReasonList(!openReasonList)}
          onChangeReason={handleChangeReason}
        />
      </div>
    </Card>
  );
};

export default ReasonSection;
