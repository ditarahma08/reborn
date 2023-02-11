import InviteFriends from '@components/account/InviteFriends.js';
import { LottieCoin } from '@components/lottie/lottie';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('InviteFriends', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<InviteFriends />);
  });

  it('render invite friends component', () => {
    expect(wrapper).to.exist;
  });

  it('render one <LottieCoin /> components', () => {
    expect(wrapper.find(LottieCoin)).to.have.lengthOf(1);
  });

  it('has 20,000 otopoints', () => {
    expect(wrapper.find('.invite-friends__caption').find('span').text()).to.contain('+20.000');
  });
});
