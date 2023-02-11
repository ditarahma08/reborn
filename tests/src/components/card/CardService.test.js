import CardService from '@components/card/CardService.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

process.env.CS_NUMBER = '081234567890';

describe('CardService', () => {
  let wrapper;
  const props = { packages: [{ name: 'Oli', total_price: 800000 }] };

  beforeEach(() => {
    wrapper = shallow(<CardService {...props} />);
  });

  it('should render card service component', () => {
    expect(wrapper).to.exist;
  });
});
