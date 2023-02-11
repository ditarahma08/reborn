import CoachMark from '@components/coach-mark/CoachMark.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CoachMark', () => {
  let wrapper;
  const props = { step: { title: 'First CoachMark' } };

  beforeEach(() => {
    wrapper = shallow(<CoachMark {...props} />);
  });

  it('should render the coachmark component', () => {
    expect(wrapper).to.exist;
  });

  /* it('should show back navigation', () => {
    wrapper.setProps({ backProps: { title: 'Balik' }, index: 1 });
    const backNav = wrapper.find('span').at(3);

    expect(backNav.text()).to.have.string('Balik');
  }); */
});
