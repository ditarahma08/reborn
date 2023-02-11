import ModalReferralSuccess from '@components/account/ModalReferralSuccess.js';
import { Button } from '@components/otoklix-elements';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

describe('ModalReferralSuccess', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ModalReferralSuccess />);
  });

  it('render modal logout component', () => {
    expect(wrapper).to.exist;
  });

  it('render one <BottomSheet /> components', () => {
    expect(wrapper.find(BottomSheet)).to.have.lengthOf(1);
  });

  it('render two <Button /> components', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(2);
  });

  it('has `Undang Teman` text button', () => {
    expect(wrapper.text().includes('Undang Teman')).to.exist;
  });

  it('has `Tutup` text button', () => {
    expect(wrapper.text().includes('Tutup')).to.exist;
  });

  it('has 20.000 reward otopoints', () => {
    expect(wrapper.text().includes('20.000')).to.exist;
  });
});
