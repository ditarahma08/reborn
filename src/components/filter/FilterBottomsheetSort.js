import { Button, Container, Text } from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

const FilterBottomsheetSort = (props) => {
  const {
    open,
    value,
    isWorkshop,
    pageName,
    onClose,
    onApply,
    isPilihBengkel = false,
    hasCar = false,
    filterSource
  } = props;

  const [activeFilter, setActiveFilter] = useState(value || '');

  const sortProduct = !hasCar
    ? [
        { param: 'price-low', display_name: 'Harga Terendah' },
        { param: 'price-high', display_name: 'Harga Tertinggi' }
      ]
    : [
        { param: '', display_name: 'Paling Sesuai' },
        { param: 'price-low', display_name: 'Harga Terendah' },
        { param: 'price-high', display_name: 'Harga Tertinggi' }
      ];

  const sortWorkshop = isPilihBengkel
    ? [
        { param: 'closest', display_name: 'Terdekat' },
        { param: 'highest-rating', display_name: 'Rating Tertinggi' },
        { param: 'price-low', display_name: 'Harga Terendah' }
      ]
    : [
        { param: 'closest', display_name: 'Terdekat' },
        { param: 'highest-rating', display_name: 'Rating Tertinggi' }
      ];

  const resetFilter = (listFilter) => {
    setActiveFilter(listFilter[0].param);
  };

  const getSortValue = (product) => {
    return product[0].displayName || 'Paling Sesuai';
  };

  const onSubmit = (value) => {
    onApply(value);

    let sortedSection;
    if (isPilihBengkel) {
      sortedSection = `workshop (${filterSource})`;
    } else {
      sortedSection = isWorkshop ? 'workshop' : 'product';
    }

    const activeProduct = sortProduct.filter((sort) => {
      return sort.param === value;
    });

    const activeWorkshop = sortWorkshop.filter((sort) => {
      return sort.param === value;
    });

    amplitude.getInstance().logEvent('sort submitted', {
      sorted_by_value: isWorkshop ? activeWorkshop[0].display_name : getSortValue(activeProduct),
      sorted_section: sortedSection,
      position: pageName
    });
  };

  const handleOptionChange = (item) => {
    setActiveFilter(item);

    amplitude.getInstance().logEvent('product list refined', {
      refine_type:
        item === ''
          ? 'sorting car compatibility'
          : item === 'price-low'
          ? 'sorting ascending'
          : 'sorting descending'
    });
  };

  useEffect(() => {
    if (open) {
      setActiveFilter(value);
      amplitude.getInstance().logEvent('sort initiated', {
        sorted_section: isWorkshop ? 'workshop' : 'product',
        positions: pageName
      });
    }
  }, [open]);

  const checkDefaultFilter = (listFilter) => {
    if (listFilter[0]?.param !== activeFilter) {
      return true;
    } else {
      return false;
    }
  };

  const renderSortOptions = (item, index) => {
    return (
      <div
        className="d-flex justify-content-between flex-row-reverse my-3 extra-filter"
        key={`sort-radio-${index}`}
        onClick={() => handleOptionChange(item?.param)}>
        <input
          data-automation={`filter-sort-radio-${item?.param}`}
          type="radio"
          className="input-radio"
          value={item?.param}
          checked={activeFilter === item?.param}
        />
        <Text>{item?.display_name}</Text>
      </div>
    );
  };

  return (
    <BottomSheet open={open} blocking={true} onDismiss={onClose}>
      <div
        className="pointer bottom-sheet-close"
        data-automation="close_filter_bottomsheet"
        onClick={onClose}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <Container>
        <div className="d-flex justify-content-between">
          <Text weight="bold">Urutkan</Text>
          {checkDefaultFilter(isWorkshop ? sortWorkshop : sortProduct) ? (
            <Text
              data-automation="filter-sort-reset-button"
              color="primary"
              className="text-md pointer"
              onClick={() => resetFilter(isWorkshop ? sortWorkshop : sortProduct)}>
              Reset
            </Text>
          ) : null}
        </div>

        <div className="my-4">
          {isWorkshop && sortWorkshop.map((item, index) => renderSortOptions(item, index))}
          {!isWorkshop && sortProduct.map((item, index) => renderSortOptions(item, index))}
        </div>

        <Button
          data-automation="filter-sort-apply-button"
          className="w-100 mb-3"
          onClick={() => onSubmit(activeFilter)}>
          Terapkan
        </Button>
      </Container>
    </BottomSheet>
  );
};

export default FilterBottomsheetSort;
