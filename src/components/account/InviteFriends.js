import { LottieCoin } from '@components/lottie/lottie';
import { Card } from '@components/otoklix-elements';

function InviteFriends({ openCard }) {
  return (
    <Card
      data-automation="account_card_referral"
      className="card-vehicle p-3 invite-friends"
      onClick={openCard}>
      <div className="d-flex justify-content-between invite-friends__title">
        <span>
          <b>Undang Teman</b>
        </span>

        <img src="/assets/icons/share.svg" alt="share-icon" width="12" height="18" loading="lazy" />
      </div>

      <div className="d-flex align-items-center mt-2">
        <div className="invite-friends__icon_coin">
          <LottieCoin />
        </div>

        <div className="ps-1 mb-0 ms-1 text-light-light invite-friends__caption">
          Undang teman kamu dan dapatkan OtoPoints hingga
          <span className="ms-1 fw-bold text-secondary">+20.000 points</span>
        </div>
      </div>
    </Card>
  );
}

export default InviteFriends;
