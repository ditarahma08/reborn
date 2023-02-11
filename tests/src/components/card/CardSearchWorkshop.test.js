import CardSearchWorkshop from '@components/card/CardSearchWorkshop.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardSearchWorkshop', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CardSearchWorkshop />);
  });

  it('should render the card search workshop component', () => {
    expect(wrapper).to.exist;
  });
});
