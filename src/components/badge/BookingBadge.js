import { Tags } from '@components/otoklix-elements';

const BookingBadge = ({ status }) => {
  switch (status) {
    case 'complain':
      return (
        <Tags pill color="danger-light" size="sm" tag="span" title="Complain" textColor="danger" />
      );
    case 'service-done':
      return (
        <Tags
          pill
          color="soft-yellow"
          size="sm"
          tag="span"
          title="Butuh Konfirmasimu"
          textColor="darker-yellow"
        />
      );
    case 'on-process':
      return (
        <Tags
          pill
          color="purple-light"
          size="sm"
          tag="span"
          title="Mobil sedang Diproses"
          textColor="purple"
        />
      );
    case 'payment':
      return (
        <Tags
          pill
          color="primary-light"
          size="sm"
          tag="span"
          title="Menunggu Pembayaran"
          textColor="primary"
        />
      );
    case 'waiting':
      return (
        <Tags
          pill
          color="white-md"
          size="sm"
          tag="span"
          title="Menunggu Dikonfirmasi"
          textColor="light-dark"
        />
      );
    case 'confirm':
      return (
        <Tags
          pill
          color="sky-blue"
          size="sm"
          tag="span"
          title="Order Dikonfirmasi"
          textColor="darker-sky-blue"
        />
      );
    case 'finish':
      return (
        <Tags pill color="success-light" size="sm" tag="span" title="Selesai" textColor="success" />
      );
    case 'review':
      return (
        <Tags
          pill
          color="primary-light"
          size="sm"
          tag="span"
          title="Review oleh Admin"
          textColor="primary"
        />
      );
    case 'cancel':
      return (
        <Tags
          pill
          color="soft-orange"
          size="sm"
          tag="span"
          title="Batal"
          textColor="darker-orange"
        />
      );
    default:
      return (
        <Tags
          pill
          color="danger-light"
          size="sm"
          tag="span"
          title="status tidak tersedia"
          textColor="danger"
        />
      );
  }
};

export default BookingBadge;
