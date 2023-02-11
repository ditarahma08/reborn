import BookingBadge from '@components/badge/BookingBadge';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Collapse,
  Divider,
  Row
} from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CardService = (props) => {
  const {
    bookingCode,
    badgeStatus,
    title,
    subtitle,
    info,
    rightImage,
    total_price,
    packages
  } = props;

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Card className="card-order mb-3 border-0 bg-white-lg">
      <CardBody>
        <img src={rightImage} className="card-image" alt="" />

        <BookingBadge status={badgeStatus} />

        <CardTitle tag="h6" className="mt-3">
          {title}
        </CardTitle>

        <CardSubtitle className="mb-3">{subtitle}</CardSubtitle>
        <CardSubtitle>{info}</CardSubtitle>

        <img
          src={isOpen ? '/assets/icons/chevron-up.svg' : '/assets/icons/chevron-down.svg'}
          onClick={() => toggle()}
          alt=""
          role="presentation"
          className="toggle-collapse"
        />
      </CardBody>

      {/* accordion section */}
      <CardBody className="py-0 border-top">
        <Collapse isOpen={isOpen}>
          <div className="py-3">
            {packages.map((item, index) => (
              <div key={index} className="d-flex">
                <div className="item w-100">{item.name}</div>
                <div className="price w-50 text-end">
                  {`Rp. ${Helper.formatMoney(item.total_price)}`}
                </div>
              </div>
            ))}

            <Divider type="dash" />

            <div className="d-flex justify-content-between align-items-center fw-bold">
              <div className="total">Total</div>
              <div className="total text-secondary">{total_price}</div>
            </div>

            <Row className="mt-3">
              <Col>
                <Button
                  className="btn btn-outline-secondary btn-sm d-block w-100"
                  onClick={Helper.openOtobuddy}>
                  Hubungi Otobuddy
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  color="secondary"
                  onClick={() => router.push(`/order/${bookingCode}`)}
                  size="sm">
                  Lihat Detail
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default CardService;
