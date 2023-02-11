import { Col, ContentWrapper, Row } from '@components/otoklix-elements';
import { listLocation } from '@utils/Constants';
import amplitude from 'amplitude-js';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ListLocation = (props) => {
  const { list } = props;
  const [newListLocation, setNewListLocation] = useState(listLocation);
  let fullPath;
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const handleClick = (data) => {
    const elm = document.getElementById('breadrumbDynamicSearch');
    elm?.scrollIntoView({ behavior: 'smooth' });

    amplitude.getInstance().logEvent('footer sitemap selected', {
      page_location: fullPath,
      footer_keyword: data?.title,
      source_search: 'dynamic search'
    });
  };

  useEffect(() => {
    if (+list?.length > 0) {
      setNewListLocation(list);
    }
  }, [list]);
  return (
    <ContentWrapper title={<h2>Cari Bengkel Berdasarkan Lokasi</h2>}>
      <Row>
        <Col className="col-location">
          {newListLocation.slice(0, 5).map((data, index) => (
            <Link href={`/bengkel/${data.slug}`} shallow={false} passHref key={index}>
              <a onClick={() => handleClick(data)}>{data.name}</a>
            </Link>
          ))}
        </Col>
        <Col className="col-location">
          {newListLocation.slice(5, 10).map((data, index) => (
            <Link href={`/bengkel/${data.slug}`} shallow={false} passHref key={index}>
              <a onClick={() => handleClick(data)}>{data.name}</a>
            </Link>
          ))}
        </Col>
      </Row>
    </ContentWrapper>
  );
};

export default ListLocation;
