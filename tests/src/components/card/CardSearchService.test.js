import CardSearchService from '@components/card/CardSearchService.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardSearchService', () => {
  const props = { badgeTitle: 'oli' };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CardSearchService {...props} />);
  });

  it('should render card search service component', () => {
    expect(wrapper).to.exist;
  });

  it('should render image workshop if it exists', () => {
    wrapper.setProps({ workshopImage: 'https://images.com' });
    const workshopImage = wrapper.find('img .ms-1');

    expect(workshopImage).to.exist;
  });

  it('should render rating icon if it exists', () => {
    wrapper.setProps({ rating: 1, ratingImage: 'https://ratingimage.com' });
    const ratingIcon = wrapper.find('[image="https://ratingimage.com"]');

    expect(ratingIcon).to.exist;
  });

  it('should render location info icon if button location is not showing and distance is exists', () => {
    wrapper.setProps({
      showButtonLocation: false,
      distance: '12km',
      locationImage: 'https://locationimage.com'
    });

    const locationInfoIcon = wrapper.find('[image="https://locationimage.com"]');
    expect(locationInfoIcon).to.exist;
  });

  it('should show button choose location when show button location is true', () => {
    wrapper.setProps({ showButtonLocation: true, locationImage: 'https://locationimage.com' });
    const buttonLocation = wrapper.find('[src="https://locationimage.com"]');

    expect(buttonLocation).to.exist;
  });

  it('should show original price when it exists', () => {
    wrapper.setProps({ originalPrice: 'Rp800.000' });
    const originalPrice = wrapper.find('.original-price');

    expect(originalPrice).to.exist;
  });
});
