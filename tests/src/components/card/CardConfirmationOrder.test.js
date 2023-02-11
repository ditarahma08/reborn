import CardConfirmationOrder from '@components/card/CardConfirmationOrder.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardConfirmationOrder', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CardConfirmationOrder />);
  });

  it('should render the card confirmation order component', () => {
    expect(wrapper).to.exist;
  });
});
