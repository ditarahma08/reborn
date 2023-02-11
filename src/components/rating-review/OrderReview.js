import { Col, Divider, Icon, Text } from '@components/otoklix-elements';
import Helper from '@utils/Helper';

const OrderReview = (props) => {
  const { orderData } = props;

  return (
    <Col className="rating-form--order-review p-2">
      <Icon
        card
        textRight
        image={orderData?.icon_link}
        imageHeight={25}
        imageWidth={25}
        title={
          <Text color="dark" weight="bold" className="text-sm">
            {orderData?.service_category}
          </Text>
        }
      />

      <Col className="d-flex justify-content-between mb-3">
        <Text color="placeholder" className="text-xxs">
          Order ID: {orderData?.booking_code}
        </Text>
        <Text color="placeholder" className="text-xxs">
          {orderData?.service_date}
        </Text>
      </Col>

      <Divider type="dash" />

      <Col className="d-flex justify-content-between my-3">
        <Text weight="semi-bold" className="text-xs rating-form--order-package-name">
          {orderData?.package_name}
        </Text>
        <Text className="text-xs">Rp{Helper.formatMoney(orderData?.package_price)}</Text>
      </Col>

      <Col className="d-flex justify-content-between my-3">
        <Text weight="semi-bold" className="text-xs">
          Diskon
        </Text>
        <Text className="text-xs">-Rp{Helper.formatMoney(orderData?.total_promo_used)}</Text>
      </Col>

      <Col className="d-flex justify-content-between my-3">
        <Text weight="semi-bold" className="text-xs">
          OtoPoints
        </Text>
        <Text className="text-xs">-Rp{Helper.formatMoney(orderData?.total_point_spent)}</Text>
      </Col>

      <Col className="d-flex justify-content-between my-3">
        <Text weight="bold" className="text-xs">
          Total
        </Text>
        <Text weight="bold" className="text-xs">
          Rp{Helper.formatMoney(orderData?.subtotal)}
        </Text>
      </Col>
    </Col>
  );
};

export default OrderReview;
