import { Col, Container, Row } from '@components/otoklix-elements';

const CarouselFooter = (props) => {
  const { imageCategory, totalImage, onClick } = props;

  return (
    <Container>
      <Row className="carousel-footer align-items-center py-2">
        <Col>
          <span>{imageCategory || '-'}</span>
        </Col>
        <Col className="d-flex justify-content-end">
          <img src="/assets/icons/image.svg" className="me-2" alt="img-ico" />
          <span className="see-more" onClick={onClick}>
            Semua foto ({totalImage || 0})
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default CarouselFooter;
