import CardPromo from '@components/card/CardPromo.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardPromo', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CardPromo />);
  });

  it('should render the card promo component', () => {
    expect(wrapper).to.exist;
  });
});
