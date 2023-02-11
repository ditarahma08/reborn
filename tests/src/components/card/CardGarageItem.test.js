import CardGarageItem from '@components/card/CardGarageItem.js';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('CardGarageItem', () => {
  let wrapper;

  const props = {
    healthData: [
      { name: 'kampas_rem', color: '', condition: 'none' },
      { name: 'kondisi_ban_depan_kiri', color: '', condition: 'none' },
      { name: 'volume_oli', color: '', condition: 'none' }
    ]
  };

  beforeEach(() => {
    wrapper = shallow(<CardGarageItem {...props} />);
  });

  it('should render the card garage item component', () => {
    expect(wrapper).to.exist;
  });
});
