import { Card } from '@components/otoklix-elements';

function ProfileSecurity({ openCard }) {
  return (
    <Card className="bg-white-lg border-0 p-2 profile-security mt-2" onClick={openCard}>
      <div className="d-flex mb-2 text-warning">
        <img
          src="/assets/icons/info-circle-warning.svg"
          width="16"
          height="18"
          alt="info-circle-warning"
          loading="lazy"
        />
        <span className="ms-2">
          <b>Profil kamu belum aman</b>
        </span>
      </div>

      <span className="text-light-light">
        Untuk keamanan akun, segera lengkapi data diri kamu dengan klik banner ini.
      </span>
    </Card>
  );
}

export default ProfileSecurity;
