import { Badge, Button, Card, CardTitle, Tags } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';

const CardNewCar = ({ data, setDefaultCar, index }) => {
  const router = useRouter();

  const isSelected = () => data.is_selected !== 0;

  return (
    <Card
      className={`card-my-car p-2 mb-3${isSelected() ? ' active' : ''}`}
      data-automation={`card_car_${index}`}>
      <CardTitle className="position-relative fw-bold d-flex align-items-center">
        {data.car_details.car_model.brand.name}

        {isSelected() && (
          <Tags title="UTAMA" size="sm" pill className="ms-2 fw-normal" color="secondary" />
        )}

        {isSelected() && (
          <Badge
            className="position-absolute top-0 end-0 rounded-circle"
            color="off-white"
            fontColor="secondary">
            <img className="badge-image" src="/assets/icons/checklist.svg" alt="" />
          </Badge>
        )}
      </CardTitle>

      <div
        className="d-flex justify-content-between"
        data-automation={`card_car_detail_section_${index}`}>
        <div>
          <span className="value">{`${data?.car_details?.car_model?.model_name} ${
            data?.car_details?.variant
          } ${data?.license_plate ? '|' : ''} ${data?.license_plate || ''}`}</span>
          <br />
          <span className="value">{`${data?.year ? data.year : '-'} • ${Helper.fuelConverter(
            data.car_details.fuel
          )} • ${Helper.transmissionConverter(data.transmission)}`}</span>
        </div>
        <div>
          <img
            className="car-image"
            src={data.car_details.car_model.image_link || '/assets/images/no-car.png'}
            alt=""
          />
        </div>
      </div>

      <div className="d-flex mt-3">
        <Button
          id="button_detail_car"
          className={!isSelected() ? 'text-primary me-2' : 'text-primary'}
          block
          color="line"
          outline
          data-automation={`card_car_lihat_detail_button_${index}`}
          onClick={() => router.push(`/garasi/${data.id}`)}>
          Lihat Detail
        </Button>

        {!isSelected() && (
          <Button
            id="button_choose_car"
            block
            color="line"
            outline
            onClick={() => setDefaultCar(data.id)}
            data-automation={`card_car_pilih_mobil_button_${index}`}
            className="text-primary">
            Pilih Mobil
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CardNewCar;
