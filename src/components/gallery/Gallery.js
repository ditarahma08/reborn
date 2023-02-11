import { Col, Row } from '@components/otoklix-elements';

function Gallery({ data }) {
  return (
    <Row>
      <Col>
        <img src={data.image_link} className="img-gallery" alt={data.category} />
      </Col>
    </Row>
  );
}

export default Gallery;
