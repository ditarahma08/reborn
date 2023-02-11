function ProfileCompleteness({ percentage, onEdit, progress }) {
  return (
    <div className="d-flex align-items-center profile-completeness" onClick={onEdit}>
      <img
        src="/assets/images/alert-profile.png"
        alt="complete-profle"
        height="36"
        width="36"
        loading="lazy"
      />

      <div className="text-light-light profile-completeness__progress mx-3">
        <span>Yuk, lengkapi lagi profil kamu</span>

        <div className="progress mt-1 mb-1">
          <div
            className="progress-bar bg-secondary"
            role="progressbar"
            style={{ width: `${percentage}%` }}></div>
        </div>

        <span>{progress}/4 Sudah Terisi</span>
      </div>

      <img src="/assets/icons/arrow-right-light.svg" height={16} alt="arrow-right" loading="lazy" />
    </div>
  );
}

export default ProfileCompleteness;
