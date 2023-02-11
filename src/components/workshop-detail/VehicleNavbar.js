import { Col, Icon, Text } from '@components/otoklix-elements';

const VehicleNavbar = (props) => {
  const { car, onEditCar } = props;

  const generateCarPlateLabel = (car) => {
    if (car?.carModel) {
      return car?.carPlate ?? '';
    } else {
      return '+ Tambah Mobil';
    }
  };

  return (
    <Col className="d-flex align-items-center ms-2">
      <Icon
        imageHeight={24}
        image={car?.carImage ?? '/assets/images/no-car.png'}
        className="workshop-navbar-vehicle--icon"
      />
      <Col className="d-flex flex-column ms-2">
        <Text
          tag="a"
          color="primary"
          weight="bold"
          className="text-underline text-xxs pointer"
          onClick={onEditCar}>
          {generateCarPlateLabel(car)}
        </Text>
        <Text className="text-xxs"> {car?.carModel || 'Order Servis, Makin Praktis'}</Text>
      </Col>

      {car?.carVariantId && (
        <Text color="secondary" weight="bold" className="text-xs me-2 pointer" onClick={onEditCar}>
          Ganti
        </Text>
      )}
    </Col>
  );
};

export default VehicleNavbar;
