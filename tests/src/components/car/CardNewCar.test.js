import CardNewCar from '@components/car/CardNewCar.js';
import { expect } from 'chai';
import chai from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

chai.use(require('sinon-chai'));

const mockRouterPush = sinon.spy();

jest.mock('next/router', () => ({
  ...jest.requireActual('next/router'),
  useRouter: () => ({
    push: mockRouterPush
  })
}));

describe('CardNewCar', () => {
  let wrapper;
  const mockSetDefaultCar = sinon.spy();

  const props = {
    data: {
      is_selected: 0,
      car_details: { car_model: { model_name: 'xenia', brand: { name: 'daihatsu' } } }
    }
  };

  beforeEach(() => {
    wrapper = shallow(<CardNewCar {...props} setDefaultCar={mockSetDefaultCar} />);
  });

  it('should render the card new car component', () => {
    expect(wrapper).to.exist;
  });

  it('should show is selected label tag', () => {
    wrapper.setProps({
      data: {
        is_selected: 1,
        car_details: { car_model: { model_name: 'xenia', brand: { name: 'daihatsu' } } }
      }
    });

    const selectedTag = wrapper.find('.fw-normal');

    expect(selectedTag).to.exist;
  });

  it('should show car year label', () => {
    wrapper.setProps({
      data: {
        is_selected: 1,
        year: '2018',
        car_details: { car_model: { model_name: 'xenia', brand: { name: 'daihatsu' } } }
      }
    });

    const yearLabel = wrapper.find('.value').at(1);

    expect(yearLabel.text()).to.have.string('2018');
  });

  it('should move the route to garage page', () => {
    wrapper.setProps({
      data: {
        id: 12345,
        is_selected: 1,
        year: '2018',
        car_details: { car_model: { model_name: 'xenia', brand: { name: 'daihatsu' } } }
      }
    });

    const detailButton = wrapper.find('Button').first();
    detailButton.prop('onClick')();

    expect(mockRouterPush).to.have.been.calledWith('/garasi/12345');
  });

  it('should set the default car', () => {
    const setCarButton = wrapper.find('Button').last();
    setCarButton.prop('onClick')();

    expect(mockSetDefaultCar.calledOnce).to.be.true;
  });
});
