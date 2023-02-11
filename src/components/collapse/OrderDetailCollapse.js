import { Collapse, Divider, WidgetListItem } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import { useState } from 'react';

const OrderDetailCollapse = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WidgetListItem
        title={Helper.shortenName(item.name)}
        titleClassName="text-label fw-normal fs-7 w-100"
        subtitle={`Rp${Helper.formatMoney(item.total_price)}`}
        subtitleColor="body"
        subtitleClassName="fs-7 fw-normal w-50 text-end"
        accordionRightImage={
          item?.package_details ? (
            <img
              role="presentation"
              className="pointer"
              onClick={() => setIsOpen(!isOpen)}
              src={isOpen ? '/assets/icons/arrow-up.svg' : '/assets/icons/arrow-down.svg'}
              alt=""
            />
          ) : null
        }
      />
      {item?.package_details ? (
        <Collapse isOpen={isOpen}>
          <Divider type="dash" />
          {item?.package_details.map((detail, idx) => (
            <>
              <WidgetListItem
                key={idx}
                title={detail.name}
                titleClassName="text-label fw-normal fs-7 w-100"
                subtitle={`${
                  detail?.category === 'custom' && detail?.quantity > 1
                    ? `${detail?.quantity} x `
                    : ''
                } Rp${Helper.formatMoney(detail.price)}`}
                subtitleColor="body"
                subtitleClassName="fs-7 fw-normal w-50 text-end"
              />
              {detail?.line_item && Object.keys(detail?.line_item)?.length > 0 && (
                <WidgetListItem
                  title={detail?.line_item?.items?.name}
                  titleClassName="text-label fw-normal fs-7 w-100 text-xxs"
                  subtitle={`Rp${Helper.formatMoney(detail?.line_item?.items?.price)}`}
                  subtitleColor="body"
                  subtitleClassName="fs-7 fw-normal w-50 text-end text-xxs"
                />
              )}
            </>
          ))}
        </Collapse>
      ) : null}
    </>
  );
};

export default OrderDetailCollapse;
