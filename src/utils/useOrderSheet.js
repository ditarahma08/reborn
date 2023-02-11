import Helper from '@utils/Helper';
import { useState } from 'react';

function useOrderSheet() {
  const [openOrderSheet, setOpenOrderSheet] = useState(false);
  const [activePkg, setActivePkg] = useState(null);
  const [cartPkg, setCartPkg] = useState([]);

  function dispatch(action) {
    if (action.type == 'closeSheet') {
      setOpenOrderSheet(false);
    }
    if (action.type == 'editLineItem') {
      const { packageDetailId, lineItemValues } = action.payload;
      let newActiveCartDetailArray = [];
      cartPkg.forEach((item) => {
        if (item.package_detail_id == packageDetailId) {
          newActiveCartDetailArray.push({
            package_detail_id: packageDetailId,
            line_item_id: lineItemValues.id,
            price: lineItemValues.price,
            original_price: lineItemValues.original_price,
            is_discounted: lineItemValues.is_discounted
          });
        } else {
          newActiveCartDetailArray.push(item);
        }
      });
      setCartPkg(newActiveCartDetailArray);
    }
    if (action.type == 'initActivePkg') {
      const item = action.payload;

      // Prepare Data to Push to Backend
      let tempData = [];

      item.detail.main.forEach((detail) => {
        let tempValues = {
          package_detail_id: detail.id,
          line_item_id: 0,
          price: detail.price,
          original_price: detail.original_price,
          is_discounted: detail.is_discounted
        };
        const lineItems = detail.line_item?.items;
        if (Helper.isNotEmptyArray(lineItems)) {
          let lineItem = lineItems.find((item) => item.is_default) || lineItems[0];
          tempValues.line_item_id = lineItem.id;
          tempValues.price = lineItem.price;
          tempValues.original_price = lineItem.original_price;
          tempValues.is_discounted = lineItem.is_discounted;
        }

        tempData.push(tempValues);
      });
      setCartPkg(tempData);
      setActivePkg(item);
      setOpenOrderSheet(true);
    }
  }

  let originalGrandTotal = cartPkg.reduce((sum, item) => sum + item.price, 0);
  let grandTotal;
  let discountedTotalPrice;
  let pointGet = Helper.OtopointsCalc(originalGrandTotal);
  return {
    openOrderSheet,
    setOpenOrderSheet,
    activePkg,
    cartPkg,
    setActivePkg,
    order: {
      originalGrandTotal,
      grandTotal,
      discountedTotalPrice,
      pointGet
    },
    dispatch
  };
}

export default useOrderSheet;
