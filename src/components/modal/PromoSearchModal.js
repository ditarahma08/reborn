import CardPromo from '@components/card/CardPromo';
import {
  Alert,
  Button,
  Container,
  EmptyState,
  Header,
  Input,
  Modal
} from '@components/otoklix-elements';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Div100vh from 'react-div-100vh';

const PromoSearchModal = (props) => {
  const {
    toggle,
    setToggle,
    isLoading,
    promos,
    hasError,
    setHasError,
    handleSelectVoucher,
    errorMessage
  } = props;

  const [inputPromo, setInputPromo] = useState('');

  const onClickInputPromo = () => {
    if (inputPromo) {
      const item = {
        promo_code: inputPromo,
        inputType: 'manual'
      };
      handleSelectVoucher(item);
    }
  };

  const handleInputPromo = (e) => {
    setInputPromo(e.target.value);
  };

  useEffect(() => {
    if (toggle) {
      setInputPromo('');
    }
  }, [toggle]);

  return (
    <Modal
      isOpen={toggle}
      className="wrapper wrapper-xs modal-no-shadow"
      toggle={setToggle}
      backdrop={false}
      keyboard={false}>
      <Div100vh>
        <Header title="Pilih Voucher" onBackClick={setToggle} />
        <Scrollbars autoHide universal={true} autoHeight autoHeightMin={'calc(100vh - 80px)'}>
          <div className="margin-behind-header" />
          <Container className="content-wrapper mb-3">
            {hasError && (
              <Alert borderColor="danger" textColor="danger" onClose={() => setHasError(false)}>
                Sayangnya, promo <b>{errorMessage}</b> tidak dapat digunakan
              </Alert>
            )}
          </Container>
          <Container className="content-wrapper d-flex mb-5">
            <Input
              className="me-1"
              bsSize="md"
              placeholder="Masukkan Kode Promo"
              onChange={handleInputPromo}
            />
            <Button
              id="button_use_promo"
              loading={isLoading}
              size="sm"
              color="secondary"
              outline
              onClick={onClickInputPromo}>
              Gunakan
            </Button>
          </Container>
          <Container className="content-wrapper">
            {promos?.map((item, index) => (
              <CardPromo
                key={index}
                imageLink={item.image_link ? item.image_link : '/assets/images/noimage.png'}
                onSelectVoucher={() => handleSelectVoucher(item)}
              />
            ))}
          </Container>
          {promos.length == 0 && (
            <div className="pt-5">
              <EmptyState
                image="/assets/images/no-voucher.png"
                imgWidth={140}
                captionAsTitle={true}>
                <div className="warning-message">Tidak ada promo untuk ditampilkan</div>
              </EmptyState>
            </div>
          )}
        </Scrollbars>
      </Div100vh>
    </Modal>
  );
};

export default PromoSearchModal;
