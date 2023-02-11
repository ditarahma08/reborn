import CardOrder from '@components/card/CardOrder.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

process.env.CS_NUMBER = '081234567890';

describe('CardOrder', () => {
  let wrapper;
  let props = { packages: [{ name: 'Paket Aki' }] };

  beforeEach(() => {
    wrapper = shallow(<CardOrder {...props} />);
  });

  it('should render card order the component', () => {
    expect(wrapper).to.exist;
  });

  it('should render max time confirmation section', () => {
    wrapper.setProps({ badgeStatus: 'waiting', maximumTime: '30-12-2021' });
    const maxTimeLabel = wrapper.find('.text-dark');
    expect(maxTimeLabel.text()).to.have.string('Order Akan Dikonfirmasi Sebelum');
  });
});
