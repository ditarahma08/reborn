import CustomModal from '@components/modal/CustomModal';

const FlagshipModal = ({ showFlagshipModal, closeFlagshipModal, tier }) => {
  return (
    <CustomModal
      show={showFlagshipModal}
      title={`Bengkel Otoklix ${tier === 'Flagship' ? 'Flagship' : 'Flagship Plus'}`}
      caption={
        <span>
          Bengkel Otoklix terverifikasi yang{' '}
          {tier === 'Flagship'
            ? 'hanya menyediakan pilihan servis tertentu'
            : 'menyediakan pilihan servis terlengkap'}
        </span>
      }
      submitButton="Oke, Mengerti"
      onSubmit={closeFlagshipModal}
    />
  );
};

export default FlagshipModal;
