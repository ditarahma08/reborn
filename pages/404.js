import PrivateLayout from '@components/layouts/PrivateLayout';
import { EmptyState } from '@components/otoklix-elements';
import { useRouter } from 'next/router';
import { use100vh } from 'react-div-100vh';

export default function FourOhFour() {
  const height = use100vh();
  const router = useRouter();

  return (
    <PrivateLayout hasAppBar={false}>
      <div
        className="d-flex align-content-center justify-content-center align-items-center empty-state-page"
        style={{ height: height }}>
        <EmptyState
          image="/assets/images/404.png"
          title="Oops!"
          imgHeight={300}
          imgAlt="Otoklix"
          mainButtonTitle="Kembali Ke Home"
          onMainButtonClick={() => router.push('/servis')}>
          Halaman yang kamu cari ga ada nih
        </EmptyState>
      </div>
    </PrivateLayout>
  );
}
