import { Button, Card } from '@components/otoklix-elements';

const CardConfirmationOrder = ({ imgSrc, title, subtitle, onClickEdit }) => {
  return (
    <Card className="overflow-hidden border-0 mb-4 card-konfirmasi-order">
      <div className="d-flex justify-content-between align-items-start inner-card">
        <div className="d-flex justify-content-around align-items-center ps-3">
          {imgSrc && <img src={imgSrc} alt="" className="me-3 car-image" />}

          <div className="d-flex flex-column">
            <span className="card-title">{title}</span>

            <span className="card-value">{subtitle}</span>
          </div>
        </div>

        <Button className="p-0 pe-3 d-none" color="link" onClick={onClickEdit}>
          Ubah
        </Button>
      </div>
    </Card>
  );
};

export default CardConfirmationOrder;
