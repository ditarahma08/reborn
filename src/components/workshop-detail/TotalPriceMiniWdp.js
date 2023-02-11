import { AbsoluteWrapper, Button, Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';

const TotalPriceMiniWdp = (props) => {
  const { handleSelectWorkshop, totalPrice, isFetching } = props;

  return (
    <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom choose-ws-section">
      <div className="d-flex justify-content-between">
        <div className="align-self-center">
          <Text className="title d-block">Harga</Text>
          <Text color="primary" className="fw-bold price d-block">
            {isFetching ? <Skeleton width={120} height={20} className="mt-1 mb-0" /> : totalPrice}
          </Text>
        </div>
        <div className="align-self-center">
          <Button
            disabled={isFetching}
            className="px-3 ms-2"
            size="md"
            onClick={handleSelectWorkshop}>
            Pilih Bengkel
          </Button>
        </div>
      </div>
    </AbsoluteWrapper>
  );
};

export default TotalPriceMiniWdp;
