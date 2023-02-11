import { LottieCoin } from '@components/lottie/lottie';
import { Button, ContentWrapper } from '@components/otoklix-elements';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { find, isEmpty } from 'lodash';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';

const CardPackageItem = dynamic(() => import('@components/card/CardPackageItem'));
const CardPackageTitle = dynamic(() => import('@components/card/CardPackageTitle'));
const GuaranteeCollapse = dynamic(() => import('@components/collapse/GuaranteeCollapse'));

const OrderSheet = (props) => {
  const {
    openSheet,
    activePkg,
    cartPkg,
    order,
    showOtopoints,
    onSpringStart,
    onSubmit,
    onSelectLineItem,
    onDismiss,
    workshopType,
    amplitudeValue
  } = props;
  const ws = activePkg?.workshop;
  const wsTier = ws?.tier?.value;

  const showGuaranteeSection = wsTier !== 'non_verified' && wsTier !== 'verified';
  let footerHeight = 325;
  if (showGuaranteeSection) {
    footerHeight += 65;
  }

  useEffect(() => {
    if (openSheet) {
      GtmEvents.gtmPdpOrderSheet(activePkg, cartPkg);

      amplitude.getInstance().logEvent('screen viewed', {
        screen_name: 'product detail',
        screen_category: 'browse',
        page_location: amplitudeValue?.page_location
      });
    }
  }, [openSheet]);

  const handleSubmit = () => {
    if (!isEmpty(amplitudeValue)) {
      amplitude.getInstance().logEvent('product added to cart', amplitudeValue);
      amplitude.getInstance().logEvent('checkout initiated', {
        product_name: amplitudeValue?.product_name,
        service_category_name: amplitudeValue?.service_category_name,
        workshop_name: amplitudeValue?.workshop_name,
        page_location: amplitudeValue?.page_location,
        is_fulfilled_by_otoklix: amplitudeValue?.is_fulfilled_by_otoklix
      });
    }
    onSubmit();
  };

  return (
    <BottomSheet
      className="box-mobile-first bottom-sheet-map workshop-sheet"
      open={openSheet}
      onSpringStart={onSpringStart}
      onDismiss={onDismiss}
      skipInitialTransition
      initialFocusRef={false}
      scrollLocking={false}
      blocking={false}
      snapPoints={({ maxHeight }) => [maxHeight - 10]}
      header={
        <CardPackageTitle
          title={Helper.shortenName(activePkg?.name)}
          description={activePkg?.description}
          image={
            activePkg?.image_link
              ? activePkg?.image_link
              : '/assets/images/default-package-header.png'
          }
        />
      }
      footer={
        workshopType !== 'non_verified' && (
          <div>
            <div className="total-container p-3">
              <div>
                <div className="total-title mb-1">Total Bayar</div>
                <div className="total-amount">{`Rp${Helper.formatMoney(
                  order.originalGrandTotal
                )}`}</div>
              </div>
              {showOtopoints && (
                <div>
                  <div className="total-title mb-1">Akan mendapatkan</div>
                  <div className="d-flex align-items-center title">
                    <div style={{ marginTop: -10 }}>
                      <LottieCoin width={16} height={16} />
                    </div>
                    <div className="ms-1 total-points">{`+${Helper.formatMoney(
                      order.pointGet
                    )} OtoPoints`}</div>
                  </div>
                </div>
              )}
            </div>

            {showGuaranteeSection && <GuaranteeCollapse className="guarantee bg-bg" />}

            <div className="p-3">
              <Button tabIndex="-1" onClick={handleSubmit} size="sm" color="secondary" block>
                Tambah Pesanan
              </Button>
            </div>
          </div>
        )
      }>
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={`calc(100vh - ${footerHeight}px)`}
        universal={true}>
        <ContentWrapper title="Rincian Paket" className="p-3 fw-weight-600">
          <div style={{ height: '100%' }} className="scrollable-package">
            {activePkg &&
              cartPkg.map((cartDetail, index) => {
                const activePkgDetail = activePkg.detail.main.find(
                  (x) => x.id == cartDetail.package_detail_id
                );
                const selectedLineItem = find(activePkgDetail?.line_item?.items, {
                  id: cartDetail?.line_item_id
                });
                return (
                  <div key={index}>
                    <CardPackageItem
                      packageDetailId={activePkgDetail?.id}
                      title={activePkgDetail?.name}
                      subtitle={activePkgDetail?.description}
                      image={activePkgDetail?.image_link ?? '/assets/icons/package-item.svg'}
                      lineItem={activePkgDetail?.line_item}
                      isDiscounted={cartDetail?.is_discounted}
                      originalPrice={cartDetail?.original_price}
                      price={cartDetail?.price}
                      selectedLineItem={selectedLineItem}
                      selectLineItem={onSelectLineItem}
                    />
                  </div>
                );
              })}
          </div>
        </ContentWrapper>
      </Scrollbars>
    </BottomSheet>
  );
};

export default OrderSheet;
