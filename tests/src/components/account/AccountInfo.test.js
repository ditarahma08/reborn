import AccountInfo from '@components/account/AccountInfo.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('AccountInfo', () => {
  let wrapper;

  describe('without authentication', () => {
    const props = {
      user: { email: 'user@mail.com' },
      isAuth: false
    };

    beforeEach(() => {
      wrapper = shallow(<AccountInfo {...props} />);
    });

    it('render account info component', () => {
      expect(wrapper).to.exist;
    });

    it('has `Selamat Datang` if not authenticate ', () => {
      expect(wrapper.find('b').text()).to.equal('Selamat Datang');
    });

    it('has `0` otopoints ', () => {
      expect(wrapper.find('.account-info__info-otopoints').find('span').text()).to.equal('0');
    });
  });

  describe('with authentication', () => {
    const props = {
      user: { name: 'john doe', phone_number: '+6281222647421', email: 'user@mail.com' },
      isAuth: true
    };

    beforeEach(() => {
      wrapper = shallow(<AccountInfo {...props} />);
    });

    it('render account info component', () => {
      expect(wrapper).to.exist;
    });

    it('has user name', () => {
      expect(wrapper.find('.account-info__info-label').find('span').find('b').text()).to.equal(
        props.user.name
      );
    });

    it('has phone number', () => {
      expect(wrapper.find('.account-info__info-phone').text()).to.equal(props.user.phone_number);
    });

    it('has profile image', () => {
      expect(wrapper.find('.rounded-circle')).to.have.lengthOf(1);
    });
  });
});
