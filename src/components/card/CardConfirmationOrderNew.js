import { Button, Card, CardBody, Collapse, Icon } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import { useState } from 'react';

const CardConfirmationOrderNew = ({
  className,
  parentData,
  packages,
  dataAutomation,
  dataAutomationToggle,
  dataAutomationPackage
}) => {
  const { user, isAuthenticated } = useAuth();
  const { car } = useCar(user, isAuthenticated);

  const [packageDetailToggle, setPackageDetailToggle] = useState(false);

  const togglePackageDetail = () => {
    setPackageDetailToggle(!packageDetailToggle);
  };

  const tierImage = parentData?.workshop?.tier?.image_link;
  const tierName = parentData?.workshop?.tier?.name;

  const generateCarLabel = (car) => {
    const carPlate = car?.carPlate || '';
    if (carPlate.trim()) {
      return `${carPlate} | ${car?.carName} ${car?.carModel} - ${car?.carVariant}`;
    } else {
      return `${car?.carName} ${car?.carModel} - ${car?.carVariant}`;
    }
  };

  return (
    <Card
      data-automation={dataAutomation ?? ''}
      className={`card-confirmation-order${className ? ` ${className}` : ''}`}
      key={packages?.id}>
      <CardBody>
        <div className="info">
          <div className="d-flex align-items-center justify-content-between">
            <span className="package-name" data-automation={dataAutomationPackage}>
              {Helper.shortenName(packages?.name)}
            </span>
            <Button
              color="link"
              className="shadow-none p-0"
              onClick={togglePackageDetail}
              data-automation={dataAutomationToggle}>
              {packages?.package_details?.find((item) => item?.line_item) && (
                <Icon
                  card
                  textRight
                  image={`/assets/icons/${
                    packageDetailToggle ? 'chevron-up-blue' : 'chevron-down-blue'
                  }.svg`}
                  imageHeight={25}
                />
              )}
            </Button>
          </div>
          <div className="d-flex align-items-center info--workshop">
            <span>{parentData?.workshop?.name}</span>
            {tierImage && <img className="ms-2" src={tierImage} alt={tierName} />}
          </div>
          <span>{`Rp${Helper.formatMoney(
            packages?.total_price_package ?? packages?.total_price ?? packages?.price
          )}`}</span>
          <span>{generateCarLabel(car)}</span>
        </div>

        <Collapse isOpen={packageDetailToggle} className="package-detail-collapse">
          {packages?.package_details?.map((item, index) => {
            if (item?.line_item && !Helper.isEmptyObj(item?.line_item)) {
              return (
                <div
                  className={`d-flex flex-column package-detail-collapse__item${
                    packageDetailToggle && index === 0 ? ' pt-2' : ' pt-3'
                  }`}
                  key={index}>
                  <span>{item?.line_item?.name}</span>
                  <span>{item?.line_item?.items?.name}</span>
                </div>
              );
            }
          })}
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default CardConfirmationOrderNew;
