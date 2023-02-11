import ButtonPromo from '@components/button/ButtonPromo';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('<ButtonPromo />', () => {
  it('should render the Button Promo component', () => {
    const wrapper = shallow(<ButtonPromo />);
    expect(wrapper).to.exist;
  });

  it('should render Promo Code if Active', () => {
    const props = {
      isActive: true,
      promoCode: 'AKIGS'
    };

    const wrapper = shallow(<ButtonPromo {...props} />);
    const divTitle = wrapper.find('.title');

    expect(divTitle.text()).to.have.string('AKIGS');
  });

  it('should render Promo Count if available', () => {
    const props = {
      isActive: false,
      promoCount: 10
    };

    const wrapper = shallow(<ButtonPromo {...props} />);
    const divTitle = wrapper.find('.title');

    expect(divTitle.text()).to.have.string('Tersedia 10 Promo');
  });

  it('should render Add Promo if no available promo', () => {
    const props = {
      isActive: false,
      promoCount: 0
    };

    const wrapper = shallow(<ButtonPromo {...props} />);
    const divTitle = wrapper.find('.title');

    expect(divTitle.text()).to.not.have.string('Tersedia 10 Promo');
    expect(divTitle.text()).to.have.string('Tambahkan');
  });
});
