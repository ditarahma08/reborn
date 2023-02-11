import { AbsoluteWrapper, Badge, Button, Container, Header } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import moment from 'moment';
import Div100vh from 'react-div-100vh';

const DetailEvent = ({ data, onBackClick }) => {
  const detailEvent = data.template_notification;

  const diffDate = () => {
    const momentDate = moment().locale('id').format('LL');

    return data.date === momentDate;
  };

  return (
    <Div100vh>
      {/* detail event section */}
      <Header onBackClick={onBackClick} title="Detail Event" />

      <Container className="wrapper-content detail-event">
        {data.image_banner_link && (
          <img src={data.image_banner_link} alt="" width="100%" className="rounded mb-3" />
        )}

        <span className="fs-7 title">{detailEvent.title}</span>

        <div className="d-flex align-items-center mt-1">
          <span className="fs-8 me-2 date">{data.date}</span>

          <Badge
            className="fw-normal"
            color={`${Helper.notificationBadgeColor(
              detailEvent.template_type.toLowerCase()
            )}-light`}
            pill
            style={{
              color: Helper.notificationBadgeColor(detailEvent.template_type.toLowerCase())
            }}>
            {diffDate() ? 'Open' : 'Closed'}
          </Badge>
        </div>

        <p className="mt-3 message">{detailEvent.message}</p>

        <span className="fs-7 title d-none">Reward</span>

        <p className="mt-3 message d-none">
          {detailEvent.rewardMessage ? detailEvent.rewardMessage : '-'}
        </p>
      </Container>

      <AbsoluteWrapper bottom block className="d-flex">
        <Button
          // className="me-2"
          color="secondary"
          block
          outline
          onClick={onBackClick}>
          Kembali
        </Button>

        <Button
          className="ms-2 d-none"
          color="secondary"
          block
          onClick={() => console.log('Ikuti Acara clicked')}>
          Ikuti Acara
        </Button>
      </AbsoluteWrapper>
    </Div100vh>
  );
};

export default DetailEvent;
