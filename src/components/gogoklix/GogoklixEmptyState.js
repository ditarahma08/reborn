import { Container, EmptyState } from '@components/otoklix-elements';

const GogoklixEmptyState = () => {
  return (
    <Container className="empty-state-no-footer">
      <EmptyState
        image="/assets/images/logout.png"
        title="Belum Ada Misi Yang Diselesaikan"
        titleColor="primary"
        imgHeight={140}
        imgAlt="gogoklix">
        Mulai transaksimu sekarang untuk bisa mendapatkan reward Gogoklix (Ganti Oli Gratis by
        Otoklix) sebelum periode berakhir.
      </EmptyState>
    </Container>
  );
};

export default GogoklixEmptyState;
