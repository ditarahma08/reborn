import { gtag } from '@utils/Gtag';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactWhatsapp from 'react-whatsapp';

const StickyInfo = ({ closeStickyInfo }) => {
  const router = useRouter();
  const [data, setData] = useState(null);

  const onClickButton = () => {
    gtag('open otobuddy highlight', 'clickOtoBuddyHighlight');
  };

  useEffect(async () => {
    const [stickyDataRes] = await Promise.all([fetch(`${process.env.API_URL}v2/placeholder/`)]);

    const [stickyData] = await Promise.all([stickyDataRes.json()]);

    setData(stickyData?.data);
  }, []);

  return (
    <div className="info-sticky d-flex align-items-center p-2">
      <img
        src="/assets/icons/close-sticky-top.svg"
        width="21"
        height="21"
        className="pointer"
        role="presentation"
        onClick={closeStickyInfo}
      />
      <img src={data?.icon} width="48" height="48" className="pointer ms-1 me-2" />
      <span>{data?.description}</span>
      {data?.cta_type === 'whatsapp' ? (
        <ReactWhatsapp
          onClick={() => onClickButton()}
          number={process.env.CS_EXPERT_NUMBER}
          message={data?.cta_whatsapp}
          className="ms-1">
          {data?.cta_text}
        </ReactWhatsapp>
      ) : (
        <button
          className="ms-1"
          onClick={() => {
            router.push(data?.cta_redirect_link);
          }}>
          {data?.cta_text}
        </button>
      )}
    </div>
  );
};

export default StickyInfo;
