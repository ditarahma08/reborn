import { Button, Collapse } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import React, { useState } from 'react';

const PackageDetail = ({ packageItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="d-flex mt-2 package-detail">
        <img
          className="package-image me-3"
          src={
            packageItem.image_link
              ? packageItem.image_link
              : '/assets/images/default-package-header.png'
          }
          alt=""
        />

        <span className="w-75 package-title">{packageItem.name}</span>

        <Button className="p-0" color="link" onClick={() => setIsOpen(!isOpen)}>
          <img
            src={isOpen ? '/assets/icons/chevron-up.svg' : '/assets/icons/chevron-down.svg'}
            alt=""
          />
        </Button>
      </div>

      <Collapse isOpen={isOpen}>
        <div className="d-flex flex-column mt-3">
          {packageItem?.package_details?.length > 0
            ? packageItem?.package_details.map((detailItem, index) => {
                let price = detailItem?.price;
                let original_price = detailItem?.original_price;
                if (detailItem.line_item?.items) {
                  price = detailItem?.line_item?.items?.price;
                  original_price = detailItem?.line_item?.items?.original_price;
                }

                if (price >= original_price) {
                  original_price = false;
                }
                return (
                  <div
                    key={detailItem.id}
                    className={`confirmation-package-item ${index !== 0 ? 'mt-3' : ''}`}>
                    <img
                      className="me-2 image"
                      src={
                        detailItem.image_link
                          ? detailItem.image_link
                          : '/assets/icons/package-item.svg'
                      }
                      alt=""
                    />

                    <div className="d-flex flex-column">
                      <div className="mb-2 title">{detailItem?.name}</div>
                      <div className="subtitle">{detailItem?.decription}</div>
                      <div className="mb-2 desc">{detailItem?.line_item?.items?.description}</div>
                      <div>
                        {original_price && (
                          <div className="original-price me-2">{`Rp${Helper.formatMoney(
                            original_price
                          )}`}</div>
                        )}
                        <div className="price">{`Rp${Helper.formatMoney(price)}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            : 'Tidak ada detail Paket saat ini.'}
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default PackageDetail;
