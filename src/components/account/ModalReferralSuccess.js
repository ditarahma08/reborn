import { Button } from '@components/otoklix-elements';
import { useRouter } from 'next/router';
import { BottomSheet } from 'react-spring-bottom-sheet';

function ModalReferralSuccess({ show, onClose }) {
  const router = useRouter();
  return (
    <BottomSheet
      blocking
      open={show}
      onDismiss={onClose}
      snapPoints={({ minHeight }) => minHeight + 75}>
      <div className="wrapper-content text-center d-flex flex-column modal-referral-success">
        <span>
          <b>Kode Referral Kamu Berhasil Di Input</b>
        </span>

        <img
          src="/assets/images/high-five.png"
          alt="high-five"
          height="112"
          width="112"
          className="mt-3 mb-3"
          loading="lazy"
        />

        <span className="mt-3 mb-3">
          Ayo undang temanmu ke Otoklix dan dapatkan hingga{' '}
          <b className="text-secondary">+20.000 OtoPoints</b> saat mereka melakukan transaksi
          pertama
        </span>

        <Button
          block
          color="primary"
          size="sm"
          className="mb-3"
          onClick={() => router.push('/undang-teman')}>
          Undang Teman
        </Button>
        <Button block outline color="primary" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </BottomSheet>
  );
}

export default ModalReferralSuccess;
