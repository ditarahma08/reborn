import ProfileCompleteness from '@components/account/ProfileCompleteness.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('ProfileCompleteness', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ProfileCompleteness />);
  });

  it('render modal logout component', () => {
    expect(wrapper).to.exist;
  });

  it('has valid progress count', () => {
    wrapper.setProps({
      progress: '2'
    });

    expect(wrapper.text().includes('2/4')).to.exist;
  });
});
