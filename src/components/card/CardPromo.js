import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle
} from '@components/otoklix-elements';
import Link from 'next/link';

const CardPromo = (props) => {
  const { title, subtitle, onButtonClick, imageLink, buttonTitle, onSelectVoucher, href } = props;

  return (
    <Card className="mb-3 card-promo" onClick={onSelectVoucher}>
      <CardImg width="100%" src={imageLink} alt={title} />
      {!onSelectVoucher && (
        <CardBody
          className={`px-0 pb-0 d-flex justify-content-between align-items-center ${
            onSelectVoucher ? ' text-center' : ''
          }`}>
          <div>
            <CardTitle tag="h5">{title}</CardTitle>

            <CardSubtitle tag="h6" className="mb-2 text-muted">
              {subtitle}
            </CardSubtitle>
          </div>

          {onButtonClick && (
            <Link href={href} passHref>
              <a href={href}>
                <Button size="sm" color="secondary" onClick={onButtonClick}>
                  {buttonTitle}
                </Button>
              </a>
            </Link>
          )}
        </CardBody>
      )}
    </Card>
  );
};

export default CardPromo;
