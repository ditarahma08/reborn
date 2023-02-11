import CardDetailReminder from '@components/card/CardDetailReminder';
import { Button, EmptyState, Icon, Text } from '@components/otoklix-elements';
import { BottomSheet } from 'react-spring-bottom-sheet';

const ReviewReminder = (props) => {
  const { openSheet, onDismiss, unreviewData, username, openForm } = props;

  return (
    <BottomSheet
      className="reminder-bottomsheet box-mobile-first bottom-sheet-map operation-hour-sheet"
      open={openSheet}
      skipInitialTransition
      initialFocusRef={true}
      scrollLocking={false}
      blocking={true}
      footer={
        <div>
          <div className="p-3 d-flex justify-content-between">
            <Button outline className="w-100 me-2" color="primary" size="sm" onClick={onDismiss}>
              Nanti Saja
            </Button>
            <Button color="primary" className="w-100 ms-2" size="sm" onClick={openForm}>
              Beri Review
            </Button>
          </div>
        </div>
      }>
      <div className="pt-3 px-2">
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <h2 className="px-2 mb-0">Review Bengkel</h2>
          <Icon
            className="pointer"
            image="/assets/icons/close-sticky-top.svg"
            imageWidth={20}
            imageHeight={20}
            iconClassName="close"
            onClick={onDismiss}
          />
        </div>
        <EmptyState
          image="/assets/images/no-review.png"
          imgAlt="No review"
          imgHeight={140}
          imgWidth={140}>
          <div className="d-flex flex-column">
            <Text color="dark" className="mb-2 reminder-txt">
              Hi {username || ''} Kami Butuh Bantuanmu...
            </Text>
            <Text color="dark" className="text-xs">
              Sebelum kamu melanjutkan aktifitasmu, bantu kami menjadi lebih baik dengan memberikan
              review untuk bengkel berikut
            </Text>
          </div>
        </EmptyState>
        <hr className="mx-3 mb-4" />
        <div className="px-3">
          <CardDetailReminder
            wsName={unreviewData?.workshop?.name}
            image={unreviewData?.workshop?.image_link}
            category={unreviewData?.booking_details?.service_category}
            categoryIcon={unreviewData?.booking_details?.icon_link}
            roleName={unreviewData?.workshop?.tier?.value}
            roleIcon={unreviewData?.workshop?.tier?.image_link}
            date={unreviewData?.booking_details?.service_date}
            address={unreviewData?.workshop?.street_address}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default ReviewReminder;
