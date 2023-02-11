import { CardBody, Collapse, Text } from '@components/otoklix-elements';
import { useRouter } from 'next/router';
import { useState } from 'react';

const GuaranteeCollapse = (props) => {
  const { className, isFlagship, onOpen } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const guaranteeDays = '14';

  return (
    <div
      className={className}
      role="presentation"
      onClick={() => {
        setIsOpen(!isOpen);
        !isOpen && onOpen();
      }}>
      <CardBody className="pb-0">
        <div className="d-flex">
          <div className="flex-shrink-0">
            <img
              src="/assets/icons/garansi.svg"
              height="32"
              width="32"
              alt="guarantee"
              loading="lazy"
            />
          </div>
          <div className="flex-grow-1 ms-3">
            <div className="title">Garansi {guaranteeDays} Hari dan Harga Terjamin </div>
            <div className="subtitle mb-3">Garansi uang kembali jika produk tidak ori</div>
          </div>
          <div className="ms-auto">
            <img
              src={
                isOpen ? '/assets/icons/arrow-up-green.svg' : '/assets/icons/arrow-down-green.svg'
              }
              height="6"
              width="10"
              alt="arrow-toggle"
              loading="lazy"
            />
          </div>
        </div>

        <Collapse isOpen={isOpen} className="collapse-box">
          <div className="guarantee-content">
            <div className="mb-1 title">Garansi {guaranteeDays} Hari</div>
            <p className="subtitle">
              Otoklix memberikan garansi selama {guaranteeDays} hari setelah pengerjaan. Otoklix
              juga memberikan jaminan bagi pelanggan untuk bisa kembali ke bengkel jika terjadi
              kesalahan/kekeliruan dalam pengerjaan. Selengkapnya dapat dilihat di S&K yang berlaku
              untuk jaminan {guaranteeDays} hari ini{' '}
              <Text
                tag="a"
                className="pointer"
                onClick={() =>
                  router.push(
                    isFlagship
                      ? '/account/terms-conditions?tnc=otoklix-flagship'
                      : '/account/terms-conditions'
                  )
                }>
                {' '}
                di sini.{' '}
              </Text>
            </p>
            <div className="mb-1 title">Jaminan Harga</div>
            <p className="subtitle">
              Otoklix memberikan penawaran harga terbaik secara transparan tanpa ada biaya
              tersembunyi. Pelanggan bisa melihat estimasi biaya servis di awal.
            </p>
          </div>
        </Collapse>
      </CardBody>
    </div>
  );
};

export default GuaranteeCollapse;
