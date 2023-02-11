import { Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import Helper from '@utils/Helper';

const CardOrderDetail = ({ packages, workshop, isFetching }) => {
  const loader = (
    <>
      <div className="d-flex mt-3">
        <Skeleton width={28} height={28} />
        <Skeleton className="flex-fill ms-2" height={40} />
      </div>
      <div className="d-flex mt-2 mb-3">
        <Skeleton width={28} height={28} />
        <Skeleton className="flex-fill ms-2" height={60} />
      </div>
      <Skeleton className="w-50" height={20} />
      <Skeleton className="w-100 mt-3" height={50} />
    </>
  );

  if (!isFetching) {
    return (
      <div className="mb-3">
        <div className="d-flex flex-row flex-nowrap mt-2">
          <div className="me-2">{workshop && <img src="/assets/icons/workshops.svg" alt="" />}</div>
          <div className="mt-2">
            <Text tag="h2" className="text-sm fw-weight-600 mb-1">
              {workshop?.name}
            </Text>
            <Text className="text-xxs" color="label">
              {workshop?.address?.street}
            </Text>
          </div>
        </div>

        {packages?.map((item, index) => {
          return (
            <div className="d-flex flex-row flex-nowrap mt-2" key={index}>
              <div className="me-2">
                <img
                  src={item?.icon_link || 'assets/icons/otx-oli-small.png'}
                  alt="packages"
                  width={20}
                  height={20}
                />
              </div>
              <div className="mt-1">
                <Text tag="h2" className="text-sm fw-weight-600 mb-2">
                  {item?.name}
                </Text>

                {item?.is_discount && index === 0 && (
                  <Text
                    className="text-xxs text-price-discount text-decoration-line-through"
                    color="light">
                    {`Rp${Helper.formatMoney(item?.price_original)}`}
                  </Text>
                )}

                <Text className="text-sm text-price fw-weight-600 mb-0" color="secondary" tag="p">
                  {`Rp${Helper.formatMoney(item?.price)}`}
                </Text>

                {item?.category === 'Oli' && item?.price_original > 0 && index === 0 && (
                  <Text className="text-xxs text-price" color="label">
                    {`Rp${Helper.formatMoney(item?.price_per_liter)}/liter`}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return loader;
};

export default CardOrderDetail;
