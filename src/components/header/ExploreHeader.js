import { Button, Container, Divider, Tags } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { useRouter } from 'next/router';

const ExploreHeader = (props) => {
  const {
    serviceInit,
    geoLocation,
    toggleModalLocation,
    toggleActiveTab,
    activeTab,
    toggleOpenFilter,
    toggleOpenSorting,
    handleEditCar,
    car
  } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const hasCar = !!car?.carModel;
  const hasPlateNumber = !!car?.carPlate;

  const generateCarLabel = () => {
    if (hasPlateNumber) {
      return car?.carPlate;
    } else if (hasCar) {
      return car?.carModel;
    } else {
      return 'Tambah Mobil';
    }
  };

  const gotoSearch = () => {
    amplitude.getInstance().logEvent('explore workshop list refined', { refine_type: 'search' });
    router.push(`/explore/cari?lat=${geoLocation.lat}&lng=${geoLocation.lng}`);
  };

  return (
    <>
      <Container
        className={`d-flex justify-content-between car-header-wrapper${hasCar ? '' : '--no-car'}`}>
        <div className="d-flex flex-column">
          <span>{hasPlateNumber ? car?.carModel : 'Mobilku'}</span>
          <span>{generateCarLabel()}</span>
        </div>

        <Button
          color="link"
          tag="button"
          className="p-0 shadow-none"
          data-automation="explore_add_change_car"
          onClick={() => (hasCar && isAuthenticated ? router.push('/mobilku') : handleEditCar())}>
          {hasCar ? 'Ganti' : '+ Tambah Mobil'}
        </Button>
      </Container>
      <Container className="d-flex justify-content-between address-header-wrapper">
        <div className="d-flex flex-column">
          <span>
            Cari <span className="fw-bold text-capitalize">{serviceInit}</span> di
          </span>
          <span>{Helper.truncateText(geoLocation?.address, 30)}</span>
        </div>

        <Button
          className="p-0 shadow-none"
          color="link"
          data-automation="explore_location"
          onClick={toggleModalLocation}>
          <img src="/assets/icons/chevron-down.svg" width={16} alt="" />
        </Button>
      </Container>
      <Divider />
      <Container className="d-flex justify-content-between pb-3">
        <div className="d-flex">
          <Tags
            onClick={toggleActiveTab}
            iconClassName="icon"
            icon={`/assets/icons/${activeTab === 'peta' ? 'pin-point-white' : 'list-white'}.svg`}
            title={activeTab}
            className="d-flex text-capitalize py-1 px-3 tags"
            data-automation="explore_active_tab_map"
          />
          <Tags
            onClick={toggleOpenFilter}
            iconClassName="icon"
            icon="/assets/icons/chevron-down.svg"
            color="subtle"
            textColor="dark"
            title="Filter"
            className="d-flex text-capitalize py-1 px-2 mx-2 tags reverse"
            data-automation="explore_filter_button"
          />
          {activeTab === 'peta' && (
            <Tags
              onClick={toggleOpenSorting}
              iconClassName="icon up-down"
              icon="/assets/icons/chevron-up-down.svg"
              color="subtle"
              textColor="dark"
              title="Urutkan"
              className="d-flex text-capitalize py-1 px-2 tags reverse"
              data-automation="explore_sort_button"
            />
          )}
        </div>
        <Button
          className="p-0 shadow-none"
          color="link"
          data-automation="explore_search_button"
          onClick={gotoSearch}>
          <img src="/assets/icons/search-orange.svg" alt="" />
        </Button>
      </Container>
    </>
  );
};

export default ExploreHeader;
