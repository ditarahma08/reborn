import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function WatchImpression({
  data,
  index,
  display,
  children,
  primaryKey,
  ratioPush = 1,
  skipModal = true,
  impressions = [],
  useInViewOptions,
  onChange,
  onPush
}) {
  const [ref, inView, entry] = useInView(useInViewOptions);
  let next = true;

  if (typeof document !== 'undefined') {
    const modalElelement = document?.querySelector('.modal') ?? null;
    next = skipModal && modalElelement !== null ? false : true;
  }

  const addImpressionList = () => {
    const detected = impressions?.length && impressions.find((item) => item.position == index + 1);
    if (!detected) {
      let newImpressions = impressions;
      data.position = index + 1;
      data.primaryKey = primaryKey;
      data.entryPublish = false;
      data.entryTime = entry?.time;
      data.entryRatio = entry?.intersectionRatio;
      newImpressions.push(data);
      onChange(newImpressions);
    }
  };

  const deleteImpressionList = () => {
    let newImpressions = impressions.filter((item) => item?.position !== index + 1);
    onChange(newImpressions);
    setTimeout(() => {
      addImpressionList();
    }, 50);
  };

  const checkUpdatedData = () => {
    const detected = impressions?.length && impressions.find((item) => item.position == index + 1);
    if (detected && detected.primaryKey !== primaryKey) {
      deleteImpressionList();
    }
  };

  const pushImpressionList = () => {
    const detected = impressions?.length && impressions.find((item) => item.position == index + 1);
    if (detected) {
      if (entry?.intersectionRatio >= ratioPush) {
        let impressionsByEntry = impressions.filter(
          (item) => item?.entryTime == detected?.entryTime
        );
        const position = impressionsByEntry[impressionsByEntry?.length - 1]?.position;
        if (detected.position == position && !detected.entryPublish) {
          let newImpressions = impressions.map((item) => {
            if (item.entryTime == detected?.entryTime) {
              item.entryPublish = true;
            }
            return item;
          });
          onChange(newImpressions);
          onPush(impressionsByEntry);
        }
      }
    }
  };

  useEffect(() => {
    if (next && data && impressions && entry?.isIntersecting !== undefined) {
      if (inView) {
        addImpressionList();
      }
    }
  }, [inView]);

  useEffect(() => {
    if (next && data && impressions && entry?.isIntersecting !== undefined) {
      checkUpdatedData();
      setTimeout(() => {
        pushImpressionList();
      }, 100);
    }
  }, [entry?.intersectionRatio]);

  return (
    <div ref={ref} style={{ display: display ?? 'inline' }}>
      {children}
    </div>
  );
}
