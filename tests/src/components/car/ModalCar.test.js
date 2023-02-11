import ModalCar from '@components/car/ModalCar.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('ModalCar', () => {
  let wrapper;

  const props = {
    carData: {
      id: 12345,
      license_plate: 'AB 12345 BD',
      car_details: { id: 67890, car_model: { model: { name: 'innova' } } }
    }
  };

  beforeEach(() => {
    wrapper = shallow(<ModalCar {...props} />);
  });

  it('should render modal car component', () => {
    expect(wrapper).to.exist;
  });
});
