import { Container, Text } from '@components/otoklix-elements';

const GogoklixBenefit = () => {
  return (
    <Container className="bg-white-lg d-flex flex-column align-items-center text-center p-4 pt-5">
      <Text color="title" weight="bold" className="gogoklix__benefit-title">
        KEUNTUNGAN YANG BAKAL KAMU DAPAT
      </Text>

      <Text color="body" className="text-xs my-3">
        Otoklix adalah aplikasi booking servis mobil yang memudahkan kamu menemukan bengkel terdekat
        maupun layanan seperti ganti oli, ganti ban, tune-up, hingga cuci mobil.{' '}
      </Text>

      <img
        src="/assets/images/speedometer.png"
        height={112}
        width={115}
        alt="speedometer"
        className="my-5"
      />

      <Text color="primary" weight="bold" className="gogoklix__benefit-title mb-2">
        Paket Ngebut
      </Text>

      <Text color="body" className="text-xs my-3">
        Jika selesai (1), (2), dan (3), hadiah pasti berupa Ganti Oli Gratis 1x.
      </Text>

      <img src="/assets/images/turbo.png" height={72} width={97} alt="turbo" className="my-5" />

      <Text color="primary" weight="bold" className="gogoklix__benefit-title mb-2">
        Paket Turbo
      </Text>

      <Text color="body" className="text-xs my-3">
        Jika selesai (1), (2), (3), dan (4) = GRATIS Ganti Oli 1x & Lucky draw ticket Ganti Oli
        setahun.
      </Text>
    </Container>
  );
};

export default GogoklixBenefit;
