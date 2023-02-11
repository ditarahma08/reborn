import InputRadioGlobalSearch from '@components/input/InputRadioGlobalSearch';
import { Container, Divider, Input } from '@components/otoklix-elements';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const GlobalSearchFilterOptions = ({
  filters,
  slug,
  onFilterSelect,
  filterOptions,
  onChangePriceFilter
}) => {
  const sections = filters?.section_sequence[slug];
  const groups = filters?.group_by;

  if (filterOptions) {
    return (
      <Scrollbars autoHide autoHeight autoHeightMin={'450px'} universal={true}>
        <Container className="pt-3 global-filter-content-sheet">
          {sections?.map((item, index) => {
            const groupsData = groups[item?.value];
            const groupsLen = groupsData?.length;

            return (
              <React.Fragment key={index}>
                <div className="title mb-3">{item.name}</div>

                {item?.value === 'price_range_filter' ? (
                  <div className="d-flex">
                    {groups[item.value]?.map((group, groupIndex) => {
                      return (
                        <div
                          className={`flex-fill ${groupsLen === groupIndex + 1 ? 'ps-1' : 'pe-1'}`}
                          key={groupIndex}>
                          <Input
                            name={group.value}
                            className="price-range-input"
                            bsSize="sm"
                            value={filterOptions?.['price_range_filter']?.[group?.value]}
                            onChange={(e) => onChangePriceFilter(e.target.value, group.value)}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            placeholder={group.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <React.Fragment>
                    <InputRadioGlobalSearch
                      title={'Semua'}
                      name={item.value}
                      containerClassname="pb-3"
                      value={'semua'}
                      onChange={() => onFilterSelect(item?.value, 'semua')}
                      checked={filterOptions[item?.value] === 'semua'}
                      onContainerClick={() => onFilterSelect(item?.value, 'semua')}
                    />

                    {groups[item.value]?.map((group, groupIndex) => {
                      return (
                        <React.Fragment key={groupIndex}>
                          <InputRadioGlobalSearch
                            item={group}
                            name={item.value}
                            containerClassname={`${groupsLen === groupIndex + 1 ? '' : 'pb-3'}`}
                            onChange={() => onFilterSelect(item.value, group.value)}
                            value={group.value}
                            onClick={() => onFilterSelect(item?.value, 'semua')}
                            checked={filterOptions[item?.value] === group.value}
                            onContainerClick={() => onFilterSelect(item?.value, group.value)}
                          />
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                )}

                <Divider />
              </React.Fragment>
            );
          })}
        </Container>
      </Scrollbars>
    );
  } else {
    return <small>Loading</small>;
  }
};

export default GlobalSearchFilterOptions;
