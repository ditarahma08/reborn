import CardPackageTitle from '@components/card/CardPackageTitle.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardPackageTitle', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      title: 'Card Title',
      description: 'This is card description',
      image: 'https://image.com'
    };

    wrapper = shallow(<CardPackageTitle {...props} />);
  });

  it('should render card confirmation order', () => {
    expect(wrapper).to.exist;
  });
});
