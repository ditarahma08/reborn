import ProfileSecurity from '@components/account/ProfileSecurity.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('ProfileSecurity', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ProfileSecurity />);
  });

  it('render modal logout component', () => {
    expect(wrapper).to.exist;
  });

  it('has `Profil kamu belum aman` info', () => {
    expect(wrapper.text().includes('Profil kamu belum aman')).to.exist;
  });
});
