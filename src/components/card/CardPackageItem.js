import { Input } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import find from 'lodash/find';
import { forwardRef, useRef } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';

const FieldInputs = forwardRef((valueProps, ref) => {
  return (
    <>
      <Input {...valueProps} innerRef={ref} bsSize="sm" />
      <img
        {...valueProps}
        className="select-arrow-package pointer"
        src={
          valueProps.disabled
            ? '/assets/icons/arrow-down.svg'
            : '/assets/icons/arrow-down-orange.svg'
        }
        alt="arrow-down"
        loading="lazy"
      />
    </>
  );
});

FieldInputs.displayName = 'FieldInputs';

const CardPackageItem = (props) => {
  const {
    packageDetailId,
    title,
    subtitle,
    price,
    originalPrice,
    isDiscounted,
    image,
    lineItem,
    selectLineItem,
    selectedLineItem
  } = props;

  const fieldRef = useRef(null);

  const lineItems = lineItem?.items.map(({ id, name }) => ({ value: id, name: name }));

  const getSelectedItem = (id) => {
    const result = find(lineItem?.items, { id: id });

    return result;
  };

  const showDiscount = isDiscounted && originalPrice > price;

  return (
    <div className="d-flex detail-package mb-3">
      <div>
        <img
          src={image}
          className="category-icon-order"
          alt="icon-package-category"
          loading="lazy"
        />
      </div>

      <div className="content ms-3 flex-fill">
        <div className="title mb-1">{title}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}

        <div className="pricing">
          {showDiscount && (
            <span className="original-price">{`Rp${Helper.formatMoney(originalPrice)}`}</span>
          )}
          <span className="price text-secondary">{`Rp${Helper.formatMoney(price)}`}</span>
        </div>

        {lineItem && (
          <div className="line-items mt-1">
            <span className="so-small fw-weight-700 text-dark text-capitalize">
              {lineItem.description}
            </span>

            <SelectSearch
              disabled={lineItems?.length <= 1 ? true : false}
              ref={fieldRef}
              className="select-search select-search--lineitems"
              options={lineItems}
              value={selectedLineItem?.id}
              autoComplete="off"
              name="Vehicle"
              onChange={(e) => selectLineItem(packageDetailId, getSelectedItem(e))}
              renderValue={(valueProps) => <FieldInputs {...valueProps} />}
            />

            <span className="avail-text">{lineItems?.length} Pilihan Tersedia</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPackageItem;
