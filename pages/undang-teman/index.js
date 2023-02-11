import PrivateLayout from '@components/layouts/PrivateLayout';
import { Appbar as BottomBar, Button, Container, Header } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { RWebShare } from 'react-web-share';

sentryBreadcrumb('pages/undang-teman/index');

const Index = () => {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);

  const getReferralCode = async () => {
    await api.get('v2/account/profile/referral-code/').then((res) => {
      setReferralCode(res?.data?.data?.referral_code);
      setReferralLink(res?.data?.data?.yourls_link);
    });
  };

  const onClickShareReferral = () => {
    gtag('click share referral', 'clickReferral');
    copy(referralCode);
  };

  const onClickReferralLink = () => {
    copy(referralLink);
    setCopyStatus(true);
  };

  useEffect(() => {
    getReferralCode();
  }, []);

  useEffect(() => {
    gtag('view referral', 'viewReferral');
  }, []);

  return (
    <PrivateLayout
      title="Undang Teman | Otoklix"
      description=""
      metaRobots="noindex"
      isAuthenticated={isAuthenticated}
      hasAppBar={false}>
      <Div100vh>
        <Header title="Undang Teman" onBackClick={() => router.back()} />

        <Container className="wrapper-content mb-5 bg-white">
          <div className="text-center">
            <img className="d-block m-auto" src="/assets/images/high-five.png" alt="" />
            <span className="my-2 text-title-active fs-6 fw-semi-bold">
              Ayo Ajak Temanmu Gabung ke Otoklix
            </span>
            {referralLink && (
              <div className="card-referral px-3 py-2 mt-1 m-auto">
                <div className="text-placeholder mb-2">Link Referral Kamu</div>
                <div
                  className={`card-referral-link ${copyStatus && 'active'}`}
                  onClick={onClickReferralLink}>
                  <span className="">{referralLink.replace('https://', '')}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="current"
                    xmlns="http://www.w3.org/2000/svg"
                    id="svg_resize">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13 5H7C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5ZM7 2C4.23858 2 2 4.23858 2 7V13C2 15.7614 4.23858 18 7 18H13C15.7614 18 18 15.7614 18 13V7C18 4.23858 15.7614 2 13 2H7Z"
                      fill="current"></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21 8.5C21.8284 8.5 22.5 9.17157 22.5 10V16C22.5 19.5899 19.5899 22.5 16 22.5H10C9.17157 22.5 8.5 21.8284 8.5 21C8.5 20.1716 9.17157 19.5 10 19.5H16C17.933 19.5 19.5 17.933 19.5 16V10C19.5 9.17157 20.1716 8.5 21 8.5Z"
                      fill="current"></path>
                  </svg>
                </div>
              </div>
            )}
            {copyStatus && <div className="text-success fs-8 mt-1">Link Tersalin</div>}
          </div>

          <div className="steppers mt-4 mb-5">
            <div className="step step-active">
              <div>
                <div className="step-circle">1</div>
              </div>
              <div className="step-content">Bagikan link referal di atas</div>
            </div>
            <div className="step">
              <div>
                <div className="step-circle">2</div>
              </div>
              <div className="step-content">
                <span className="text-secondary fw-bold">+20.000 Otopoints</span> saat temanmu
                menyelesaikan transaksi pertama
              </div>
            </div>
          </div>
          <br />
        </Container>
      </Div100vh>
      <BottomBar className="p-2">
        <RWebShare
          data={{
            text: `Dapatkan 10.000 OtoPoints (setara Rp. 10.000) yang bisa dipakai untuk servis mobil kamu! Daftar Otoklix sekarang pakai link referral ku di `,
            url: referralLink,
            title: ''
          }}
          onClick={() => console.info('share successful!')}>
          <Button
            data-automation="account_button_share_referral"
            className="fs-8 fw-semi-bold"
            size="sm"
            block
            color="primary"
            onClick={() => onClickShareReferral()}>
            Bagikan Link Referral
          </Button>
        </RWebShare>
      </BottomBar>
    </PrivateLayout>
  );
};

export default Index;
