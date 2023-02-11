import { Container, Text } from '@components/otoklix-elements';
import { useState } from 'react';

const ReviewFacilityTab = (props) => {
  const { onClickTab } = props;

  const [activeTab, setActiveTab] = useState('review');

  const handleClickTab = (tab) => {
    setActiveTab(tab);
    onClickTab(tab);
  };

  return (
    <Container className="d-flex">
      <div
        className={`d-flex w-100 justify-content-center pointer workshop-tab-menu ${
          activeTab === 'review' ? 'active' : ''
        }`}
        onClick={() => handleClickTab('review')}>
        <Text
          weight="bold"
          className="text-sm"
          color={activeTab === 'review' ? 'primary' : 'label'}>
          Ulasan
        </Text>
      </div>
      <div
        className={`d-flex w-100 justify-content-center pointer workshop-tab-menu ${
          activeTab === 'facilities' ? 'active' : ''
        }`}
        onClick={() => handleClickTab('facilities')}>
        <Text
          weight="bold"
          className="text-sm"
          color={activeTab === 'facilities' ? 'primary' : 'label'}>
          Fasilitas
        </Text>
      </div>
    </Container>
  );
};

export default ReviewFacilityTab;
