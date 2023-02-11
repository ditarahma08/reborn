import NewCar from '@components/car/NewCar.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('NewCar', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NewCar />);
  });

  it('should render new car component', () => {
    expect(wrapper).to.exist;
  });
});
