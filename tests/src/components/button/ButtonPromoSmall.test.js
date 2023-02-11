import ButtonPromoSmall from '@components/button/ButtonPromoSmall';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('<ButtonPromoSmall />', () => {
  it('should render the Button Promo Small component', () => {
    const props = {
      promoCode: 'AKIGS'
    };

    const wrapper = shallow(<ButtonPromoSmall {...props} />);

    expect(wrapper).to.exist;
  });
});
