import { CardServices, Container, Text } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';

const PackageSheet = (props) => {
  const {
    fullPath,
    openSheet,
    onDismiss,
    packageList,
    wsDetail,
    slug,
    origin,
    activePackage,
    fromWdp = false,
    promoCode,
    otoklixGoLocation = '',
    onClickSelectPackage
  } = props;

  const [list, setList] = useState([]);
  const [sourcePage, setSourcePage] = useState('');

  const handleSelectPackage = (item) => {
    if (fromWdp) {
      amplitude.getInstance().logEvent('product package selected', {
        product_name: activePackage?.name,
        workshop_name: wsDetail?.name,
        source_list: 'workshop details',
        service_category_name: item?.category?.slug,
        variant_name: item?.name,
        page_location: fullPath
      });
    } else {
      amplitude.getInstance().logEvent('package selected', {
        product_name: item?.name,
        workshop_name: wsDetail?.name,
        source_list: sourcePage,
        service_category_name: item?.category?.slug,
        is_fulfilled_by_otoklix: item?.is_fulfilled_by_otoklix,
        page_location: fullPath
      });
    }

    const params = {
      package_id: item?.id,
      workshop: wsDetail?.slug ?? slug,
      promo: promoCode || '',
      origin: origin,
      otoklix_go: wsDetail?.otoklix_go_eligible,
      location: wsDetail?.otoklix_go_eligible && otoklixGoLocation
    };

    onClickSelectPackage(params);
  };

  const handleCloseSheet = () => {
    amplitude.getInstance().logEvent('product package skipped', {
      product_name: activePackage?.name,
      workshop_name: wsDetail?.name,
      source_list: 'workshop details',
      service_category_name: activePackage?.service_category?.slug,
      page_location: fullPath
    });

    onDismiss();
  };

  useEffect(() => {
    setList(packageList?.available_packages);

    if (packageList?.available_packages?.length > 1 && wsDetail?.name) {
      amplitude.getInstance().logEvent('product list viewed', {
        service_category_name: packageList?.selected_package?.category?.slug,
        total_product_viewed: packageList?.available_packages?.length,
        source_list: sourcePage,
        workshop_name: wsDetail?.name,
        page_location: fullPath
      });
    }
  }, [packageList, wsDetail]);

  useEffect(() => {
    let source;
    if (origin === 'pilih-bengkel') {
      source = 'search page';
    } else if (origin === 'search') {
      source = 'mini wdp';
    } else {
      source = 'full wdp';
    }

    setSourcePage(source);
  }, []);

  return (
    <BottomSheet
      className="rating-form--bottomsheet-form reminder-bottomsheet"
      open={openSheet}
      skipInitialTransition
      scrollLocking={false}
      blocking={true}>
      <div className="pointer bottom-sheet-close" onClick={handleCloseSheet}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin="50vh"
        className="py-2"
        renderView={({ style, ...props }) => (
          <div {...props} style={{ ...style, marginRight: '0px' }} />
        )}>
        <Container className="wrapper-content py-2">
          <div>
            <Text className="fs-6 fw-bold">Pilih Varian Paket</Text>
            <Text tag="p" className="my-3 text-sm d-block" color="label">
              Terdapat beberapa varian untuk produk yang kamu pilih. Silakan pilih salah satu ya
            </Text>
          </div>
          {list?.map((item) => {
            const checkSubPrice =
              item.discount_value !== 0 && `Rp${Helper.formatMoney(item?.original_price)}`;
            const isDiscountPackage = item.discount_value !== 0 && `${item?.discount_value}%`;
            const isLiter = item?.product_unit;
            return (
              <div className="mx-2 my-3 pointer package-list-wrapper" key={item?.id}>
                <CardServices
                  discountLabel={isDiscountPackage}
                  image={item?.image_link || wsDetail?.image_link}
                  categoryLabel={item?.category?.name}
                  subPrice={checkSubPrice}
                  price={`Rp${Helper.formatMoney(item?.price)}`}
                  detailPrice={isLiter && `Rp${Helper.formatMoney(item?.product_price)}/${isLiter}`}
                  title={item?.name?.split(' - ')[0]}
                  onCardClick={() => handleSelectPackage(item)}
                  data-automation="cari_workshop_service_card"
                  quantity={isLiter && item?.product_quantity && `${item?.product_quantity} liter`}
                />
              </div>
            );
          })}
        </Container>
      </Scrollbars>
    </BottomSheet>
  );
};

export default PackageSheet;
