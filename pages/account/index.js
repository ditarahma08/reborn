import AccountInfo from '@components/account/AccountInfo';
import EditAccount from '@components/account/EditAccount';
import InviteFriends from '@components/account/InviteFriends';
import ModalLogout from '@components/account/ModalLogout';
import ModalReferralSuccess from '@components/account/ModalReferralSuccess';
import ProfileCompleteness from '@components/account/ProfileCompleteness';
import ProfileSecurity from '@components/account/ProfileSecurity';
import PrivateLayout from '@components/layouts/PrivateLayout';
import ListMenuItem from '@components/list/ListMenuItem';
import CustomModal from '@components/modal/CustomModal';
import { Button, Container, ContentWrapper } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { BranchLogout } from '@utils/BranchTracker';
import { menuItems } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import MoEngage from '@utils/MoEngage';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/account/index');

const Index = () => {
  const router = useRouter();
  let fullPath = '';

  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const { isAuthenticated, user, setUser, logout } = useAuth();

  const [hasEditProfile, setHasEditProfile] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showModalReferralWarning, setShowModalReferralWarning] = useState(false);
  const [showModalReferral, setShowModalReferral] = useState(false);
  const [percentComplete, setPercentComplete] = useState(0);
  const [filledFormStep, setFilledFormStep] = useState(0);

  const goToReferralPage = () => {
    gtag('click referral', 'clickAccount');
    amplitude.getInstance().logEvent('share initiated', {
      source_icon: 'account',
      share_details: 'referral',
      page_location: fullPath
    });
    router.push('/undang-teman');
  };

  const logoutAccount = () => {
    BranchLogout();
    MoEngage.userLoggetOut();
    window.history.replaceState(null, null, window.location.pathname);
    logout();
    setShowModalLogout(false);
  };

  const generateProgressBar = () => {
    const filteredData = [];
    user?.email && filteredData.push(user?.email);
    user?.name && filteredData.push(user?.name);
    user?.profile_picture && filteredData.push(user?.profile_picture);
    user?.phone_number && filteredData.push(user?.phone_number);
    setFilledFormStep(filteredData?.length);
    const percentage = (filteredData?.length / 4) * 100;
    setPercentComplete(percentage);
  };

  const handleEditSuccess = (userData) => {
    setUser(userData);
  };

  const handleClickMenuItems = (menu) => {
    if (menu?.id === 2 || menu?.id === 3) {
      const url = process.env.APP_URL;

      window.location.href = `${url.substring(0, url?.length - 1)}${menu?.route}`;
      return;
    }

    router.push(menu?.route);
  };

  useEffect(() => {
    gtag('view account', 'viewAccount');

    const otopoints = Cookies.get('otopoints_collected');

    if (otopoints) {
      setShowModalReferral(true);
      Cookies.remove('otopoints_collected');
    }

    if (Cookies.get('invalid_referral')) {
      setShowModalReferralWarning(true);
      Cookies.remove('invalid_referral');
    }
  }, []);

  useEffect(() => {
    if (user?.phone_number) {
      generateProgressBar();
    }
  }, [user?.phone_number, user?.email, user?.profile_picture, user?.name]);

  useEffect(() => {
    if (user?.phone_number && 'edit' in router.query) {
      setHasEditProfile(true);
    } else {
      setHasEditProfile(false);
    }
  }, [user?.phone_number, router.query.edit]);

  if (hasEditProfile) {
    return (
      <EditAccount
        onBackClick={() => router.back()}
        user={user}
        onEditSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <PrivateLayout title="Akun | Otoklix" description="" metaRobots="noindex" hasAppBar>
      <div className="wrapper-full">
        <AccountInfo
          user={user}
          isAuth={isAuthenticated}
          onEdit={() => router.push('/account?edit')}
        />

        <Container className="wrapper-content">
          {isAuthenticated ? (
            <>
              {filledFormStep < 4 && (
                <ContentWrapper title="Kelengkapan Profil">
                  <ProfileCompleteness
                    user={user}
                    onEdit={() => router.push('/account?edit')}
                    percentage={percentComplete}
                    progress={filledFormStep}
                  />

                  {user?.email ? null : (
                    <ProfileSecurity openCard={() => router.push('/account?edit')} />
                  )}
                </ContentWrapper>
              )}

              <InviteFriends openCard={() => goToReferralPage()} />
            </>
          ) : (
            <Button
              id="button_login"
              tag="a"
              color="primary"
              size="sm"
              block
              onClick={() => router.push('/auth')}>
              Masuk / Daftar
            </Button>
          )}
        </Container>

        <Container className="wrapper-content mb-5">
          <ContentWrapper>
            {menuItems?.map((menu, index) => {
              return (
                <ListMenuItem
                  title={menu?.title}
                  imageLeft={`/assets/icons/${menu?.image}`}
                  onClick={() => handleClickMenuItems(menu)}
                  key={index}
                />
              );
            })}

            {isAuthenticated && (
              <Button
                tag="a"
                color="danger"
                className="mt-4"
                outline
                size="sm"
                block
                onClick={() => setShowModalLogout(true)}
                data-automation="account_button_logout">
                Log Out
              </Button>
            )}
            <br />
          </ContentWrapper>
        </Container>

        <ModalLogout
          show={showModalLogout}
          toggle={() => setShowModalLogout(false)}
          onSubmit={() => logoutAccount()}
          onCancel={() => setShowModalLogout(false)}
        />

        <ModalReferralSuccess
          show={showModalReferral}
          onClose={() => setShowModalReferral(false)}
        />
        <CustomModal
          show={showModalReferralWarning}
          title="Email kamu sudah terdaftar"
          caption="Selamat datang kembali, akun dengan email yang kamu masukan telah terdaftar. Kode referral tidak dapat digunakan."
          submitButton="Tutup"
          toggle={() => setShowModalReferralWarning(false)}
          onSubmit={() => setShowModalReferralWarning(false)}
        />
      </div>
    </PrivateLayout>
  );
};

export default Index;
