import { Button, Card } from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CardFeature = ({ pathSource }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('konsultasi');

  const handleChangeTab = (activeTab) => {
    setActiveTab(activeTab);
  };

  const handleClickFeature = (activeTab) => {
    amplitude.getInstance().logEvent('form initiated', {
      cta_location: 'middle',
      form_name: activeTab === 'otoklix pickup' ? 'PUDO' : 'Custom Order (consultation)',
      page_location: pathSource
    });
    router.push(`/${activeTab === 'otoklix pickup' ? 'otoklixpickup' : 'konsultasi'}/forms`);
  };

  return (
    <Card className="card-feature border-none">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div className="pe-3">
            <img
              src={
                activeTab === 'otoklix pickup'
                  ? '/assets/images/nearest-workshop.png'
                  : '/assets/images/top-thank-you.png'
              }
              width="80"
              height="80"
              alt="workshop"
              loading="eager"
            />
          </div>
          <div className="card-content">
            <h5>
              {activeTab === 'otoklix pickup'
                ? 'Servis Mobil, Tinggal Panggil'
                : 'Bingung karena mobilmu bermasalah?'}
            </h5>
            <p>
              {activeTab === 'otoklix pickup'
                ? 'Nikmati layanan antar jemput untuk kamu yang ingin servis mobil dengan nyaman dari rumah.'
                : 'Ayo konsultasi agar bisa dapat rekomendasi dari tim kami'}
            </p>
            <Button
              size="xs"
              className="rounded-pill px-2"
              onClick={() => handleClickFeature(activeTab)}>
              {activeTab === 'otoklix pickup' ? 'Booking Sekarang' : 'Konsultasi Sekarang'}
            </Button>
          </div>
        </div>
      </div>
      <div className="card-footer py-3">
        <div className="d-flex justify-content-around tab-section pb-2">
          <span
            onClick={() => handleChangeTab('konsultasi')}
            className={`tab pointer mb-0 ${activeTab === 'konsultasi' ? 'active' : ''}`}>
            Konsultasi Servis
          </span>
          <span
            onClick={() => handleChangeTab('otoklix pickup')}
            className={`tab pointer mb-0 ${activeTab === 'otoklix pickup' ? 'active' : ''}`}>
            Otoklix Pick Up
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CardFeature;
