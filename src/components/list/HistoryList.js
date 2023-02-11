import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import React from 'react';

const HistoryList = ({ listItems }) => {
  const router = useRouter();

  const outgoing = listItems?.transaction_type === 'Pembayaran';
  const includeMinus = listItems?.points_awarded
    ? listItems?.points_awarded.toString().includes('-')
    : '';

  const onLinkClick = () => {
    if (listItems?.booking_code) {
      router.push({ pathname: `/order/${listItems?.booking_code}` });
    }
  };

  return (
    <div onClick={() => onLinkClick()} className={`${listItems?.booking_code ? 'pointer' : null}`}>
      <div className="text-muted" style={{ fontSize: 10 }}>
        <span>{listItems?.date}</span> •{' '}
        <span className="text-primary">{listItems?.transaction_type}</span>
      </div>

      <div className="d-flex justify-content-between">
        <span className="text-dark" style={{ fontSize: 13 }}>
          {listItems?.description}
        </span>

        <div className="d-flex flex-column">
          <span className={outgoing ? 'text-danger' : 'text-success'} style={{ fontSize: 13 }}>
            {`${outgoing ? (includeMinus ? '' : '-') : '+'}${Helper.formatMoney(
              listItems?.points_awarded
            )}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
