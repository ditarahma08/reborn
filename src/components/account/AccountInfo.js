import { Card } from '@components/otoklix-elements';
import Helper from '@utils/Helper';

function AccountInfo({ user, isAuth, onEdit }) {
  return (
    <Card className="bg-off-white p-2 m-3 account-info">
      {isAuth ? (
        <div className="d-flex align-items-center">
          <img
            className="rounded-circle me-2"
            width="40"
            height="40"
            src={
              user?.profile_picture
                ? user.profile_picture
                : '/assets/images/default-profile-picture.png'
            }
            alt="prof pict"
            loading="lazy"
          />

          <div className="d-flex flex-column account-info__info-label">
            <div className="d-flex align-items-center justify-content-between">
              <span>
                <b>{user?.name ?? '-'}</b>
              </span>
              <div role="button" onClick={onEdit}>
                <img
                  src="/assets/icons/pen-grey.svg"
                  height="16"
                  width="16"
                  alt="edit"
                  loading="lazy"
                />
              </div>
            </div>

            <span className="account-info__info-phone">{user?.phone_number}</span>
          </div>
        </div>
      ) : (
        <span>
          <b>Selamat Datang</b>
        </span>
      )}

      <div className="d-flex align-items-center mt-2">
        <img src="/assets/images/bigcoin.png" width="16" alt="coin" loading="lazy" />

        <div className="ps-1 mb-0 ms-1 text-light-light account-info__info-otopoints">
          Otopoints
          <span className="ms-1 fw-bold text-secondary" data-automation="account_otopoints_amount">
            {isAuth ? Helper.formatMoney(user?.otopoints) : '0'}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default AccountInfo;
