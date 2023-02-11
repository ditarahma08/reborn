import { Card, Text } from '@components/otoklix-elements';

const OtoklixGoFeature = () => {
  return (
    <div className="row gx-2 pt-3 mx-0">
      <div className="col" data-automation="otopickup_benefit_free_pickup">
        <Card className="rounded-1 h-100 text-center py-2 px-1">
          <img src="/assets/icons/otopickupIcon1.svg" height="13" className="mb-2" alt="pickup" />
          <Text color="label" className="mt-auto d-block text-xxs mt-auto">
            Gratis Antar-Jemput
          </Text>
        </Card>
      </div>
      <div className="col" data-automation="otopickup_benefit_complete_choice">
        <Card className="rounded-1 h-100 text-center py-2 px-1">
          <img src="/assets/icons/otopickupIcon2.svg" height="13" className="mb-2" alt="service" />
          <Text color="label" className="mt-auto d-block text-xxs mt-auto">
            Pilihan Servis Lengkap
          </Text>
        </Card>
      </div>
      <div className="col" data-automation="otopickup_benefit_coverage">
        <Card className="rounded-1 h-100 text-center py-2 px-1">
          <img src="/assets/icons/otopickup-loc.svg" height="13" className="mb-2" alt="location" />
          <Text color="label" className="mt-auto d-block text-xxs mt-auto">
            Menjangkau Beberapa Area
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default OtoklixGoFeature;
