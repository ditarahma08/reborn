import OptionsCollapse from '@components/collapse/OptionsCollapse';
import { Col, Text } from '@components/otoklix-elements';

const ReviewFilter = (props) => {
  const { serviceOptions, onChangeFilter } = props;

  const sortOptions = [
    { name: 'Terbaru', icon: '', value: 'latest' },
    { name: 'Terlama', icon: '', value: 'longest' }
  ];

  const ratingOptions = [
    { name: 5, icon: '/assets/icons/star.svg' },
    { name: 4, icon: '/assets/icons/star.svg' },
    { name: 3, icon: '/assets/icons/star.svg' },
    { name: 2, icon: '/assets/icons/star.svg' },
    { name: 1, icon: '/assets/icons/star.svg' }
  ];

  const onSelectService = (service) => {
    const value = service?.name.replace(/\s+/g, '-').toLowerCase();
    onChangeFilter('category_service', value === 'semua-servis' ? '' : value);
  };

  const onSelectSort = (sort) => {
    onChangeFilter('order_by', sort?.value);
  };

  const onSelectRating = (rating) => {
    onChangeFilter('rating', rating?.name);
  };

  return (
    <Col>
      <Text
        color="dark"
        weight="bold"
        className="workshop-section-title d-flex align-items-center mb-2 text-md">
        Review
      </Text>

      <div className="d-flex align-items-center justify-content-between my-3">
        <OptionsCollapse
          options={serviceOptions}
          defaultOption={serviceOptions[0]}
          buttonWidth="145px"
          onSelect={onSelectService}
        />
        <OptionsCollapse
          options={sortOptions}
          defaultOption={sortOptions[0]}
          buttonWidth="100px"
          onSelect={onSelectSort}
        />
        <OptionsCollapse
          options={ratingOptions}
          defaultOption={ratingOptions[0]}
          buttonWidth="65px"
          onSelect={onSelectRating}
        />
      </div>
    </Col>
  );
};

export default ReviewFilter;
