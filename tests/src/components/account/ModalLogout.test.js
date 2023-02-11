import ModalLogout from '@components/account/ModalLogout.js';
import { Button, Modal, ModalBody } from '@components/otoklix-elements';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

describe('ModalLogout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ModalLogout />);
  });

  it('render modal logout component', () => {
    expect(wrapper).to.exist;
  });

  it('render one <Modal /> components', () => {
    expect(wrapper.find(Modal)).to.have.lengthOf(1);
  });

  it('render one <ModalBody /> components', () => {
    expect(wrapper.find(ModalBody)).to.have.lengthOf(1);
  });

  it('render two <Button /> components', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(2);
  });

  it('has `Kembali` text button', () => {
    expect(wrapper.text().includes('Kembali')).to.exist;
  });

  it('has `Log Out` text button', () => {
    expect(wrapper.text().includes('Log Out')).to.exist;
  });
});
