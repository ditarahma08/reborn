import Appbar from '@components/appbar/Appbar';
import { AppbarItem } from '@components/otoklix-elements';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

describe('<Appbar />', () => {
  let wrapper;

  const props = {
    path: '/servis'
  };

  beforeEach(() => {
    wrapper = mount(<Appbar {...props} />);
  });

  it('renders five <AppbarItem /> components', () => {
    expect(wrapper.find(AppbarItem)).to.have.lengthOf(4);
  });

  it('renders an `.is-active`', () => {
    expect(wrapper.find('.is-active')).to.have.lengthOf(1);
  });

  it('has `.is-active` in tab home and has valid text', () => {
    expect(wrapper.find('.is-active').text()).to.equal('Beranda');
  });

  it('has `.is-active` in tab order and has valid text', () => {
    wrapper.setProps({
      path: '/order'
    });

    expect(wrapper.find('.is-active').text()).to.equal('Order');
  });

  it('has `.is-active` in tab account and has valid text', () => {
    wrapper.setProps({
      path: '/account'
    });

    expect(wrapper.find('.is-active').text()).to.equal('Akun');
  });
});
