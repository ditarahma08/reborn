import EditAccount from '@components/account/EditAccount.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('EditAccount', () => {
  let wrapper;

  const props = {
    user: {
      name: 'User Satu',
      email: 'user@mail.com',
      profile_picture: 'https://profilepicture.com'
    }
  };

  beforeEach(() => {
    wrapper = shallow(<EditAccount {...props} />);
  });

  it('render edit account component', () => {
    expect(wrapper).to.exist;
  });

  it('render user profile picture if it is exists', () => {
    expect(wrapper.find('[src="https://profilepicture.com"]')).to.exist;
  });

  it('render user name if it is exists', () => {
    expect(wrapper.find('.info-profile-text').first().text()).to.equal('User Satu');
  });
});
