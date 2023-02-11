import InputRadioGroupPromo from '@components/input/InputRadioGroupPromo';
import { Container } from '@components/otoklix-elements';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';

const FilterSheet = (props) => {
  const { openSheet, filterPromo, handleOnApply, handleOnClose } = props;
  const [open, setOpen] = useState(openSheet);

  useEffect(() => {
    setOpen(openSheet);
  }, [openSheet]);
  return (
    <BottomSheet
      className="box-mobile-first bottom-sheet-map"
      open={open}
      snapPoints={() => [285]}
      skipInitialTransition
      scrollLocking={false}
      blocking={true}
      onSpringStart={(event) => {
        if (event.type === 'SNAP' && event.source === 'dragging') {
          handleOnClose(false);
        }
      }}>
      <div className="pointer bottom-sheet-close" onClick={() => handleOnClose(false)}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
        <Container className="px-2 mt-1">
          <InputRadioGroupPromo defaultValue={filterPromo} onApply={handleOnApply} />
        </Container>
      </Scrollbars>
    </BottomSheet>
  );
};

export default FilterSheet;
