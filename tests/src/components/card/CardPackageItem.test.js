import CardPackageItem from '@components/card/CardPackageItem.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardPackageItem', () => {
  let wrapper;
  const props = {
    isDiscounted: true,
    originalPrice: 6000000,
    price: 1000000,
    subtitle: 'This is some subtitle',
    lineItem: { items: [{ id: 1 }, { id: 2 }] },
    selectedLineItem: { id: 1 }
  };

  beforeEach(() => {
    wrapper = shallow(<CardPackageItem {...props} />);
  });

  it('should render card package item component', () => {
    expect(wrapper).to.exist;
  });

  it('should render the subtitle', () => {
    const subtitle = wrapper.find('.subtitle');
    expect(subtitle.text()).to.have.string('This is some subtitle');
  });

  it('should show the original price when discount price is exists', () => {
    const originalPrice = wrapper.find('.original-price');
    expect(originalPrice.text()).to.have.string('Rp6.000.000');
  });
});
