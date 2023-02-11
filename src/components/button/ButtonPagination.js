import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const ButtonPagination = (props) => {
  const { onClick, page, initialPage } = props;

  const router = useRouter();
  const currentPath = router.asPath.split('?')[0];
  const currentQuery = { ...router.query };

  const [pageCount, setPageCount] = useState(0);

  const getUrl = (e) => {
    delete currentQuery.slug;
    delete currentQuery.page;
    const query = {
      ...currentQuery,
      page: e
    };
    const currentUrl = `${currentPath}?${Helper.objectToQueryString(query)}`;
    if (e === 1) {
      return currentPath;
    } else {
      return currentUrl;
    }
  };

  const handlePageClick = (e) => {
    onClick(+e?.selected + 1);
  };

  useEffect(() => {
    if (page) {
      setPageCount(page?.total_page);
    }
  }, [page]);
  return (
    <>
      <div className="box-button-pagination">
        <ReactPaginate
          nextLabel={
            <img
              src={
                page?.current_page === page?.total_page
                  ? '/assets/icons/chevron-right-disable.svg'
                  : '/assets/icons/chevron-right.svg'
              }
              alt="arrow-right-thin"
              loading="lazy"
              width={15}
              height={15}
            />
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={
            <img
              src={
                +page?.current_page === 1
                  ? '/assets/icons/chevron-left-disable.svg'
                  : '/assets/icons/chevron-left.svg'
              }
              alt="arrow-left-thin"
              loading="lazy"
              width={15}
              height={15}
            />
          }
          pageClassName="button-pagination"
          pageLinkClassName="page-link"
          previousClassName="button-pagination"
          previousLinkClassName={
            +page?.current_page === 1 ? 'button-disabled page-link' : 'page-link'
          }
          nextClassName="button-pagination"
          nextLinkClassName={
            page?.current_page === page?.total_page ? 'button-disabled page-link' : 'page-link'
          }
          breakLabel="..."
          breakClassName="button-pagination"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="button-pagination-active"
          renderOnZeroPageCount={null}
          initialPage={initialPage ? +initialPage - 1 : ''}
          forcePage={initialPage ? +initialPage - 1 : ''}
          hrefBuilder={(e) => getUrl(e)}
        />
      </div>
    </>
  );
};

export default ButtonPagination;
