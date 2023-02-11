import { Col, Container, Icon, Text } from '@components/otoklix-elements';
import ReactWhatsapp from 'react-whatsapp';

const ClaimSection = (props) => {
  const { workshopName, workshopSlug, idClaim } = props;

  return (
    <Container className="bg-white-lg py-2 mb-2" id={idClaim}>
      <Col className="d-flex justify-content-between my-3">
        <Icon card image="/assets/icons/info-circle.svg" imageHeight={15} imageWidth={15} />
        <Text color="label" className="text-sm ms-1">
          Anda pemilik bengkel ini? Klik tombol di bawah untuk klaim bengkel ini sekarang
        </Text>
      </Col>

      <Col>
        <ReactWhatsapp
          number={process.env.CS_NUMBER}
          message={`Hai Otoklix, saya pengurus bengkel dan ingin klaim/mendaftarkan bengkel ini: ${workshopName} - https://otoklix.com/bengkel/${workshopSlug}`}
          className="mb-2 btn btn-outline-primary btn-md d-block w-100 so-small">
          Klaim Bengkel Ini
        </ReactWhatsapp>
      </Col>
    </Container>
  );
};

export default ClaimSection;
