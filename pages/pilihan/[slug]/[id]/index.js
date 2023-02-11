import AboutServices from '@components/footer/AboutServices';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  AccordionButton,
  Button,
  Card,
  CardBody,
  CardWorkshopExplore,
  Col,
  Container,
  ContentWrapper,
  Header,
  Row,
  Spinner,
  Tags,
  Text
} from '@components/otoklix-elements';
import { categoryQuery, contentQuery, reqOptions } from '@pages/api/graphql/query';
import { apiServer } from '@utils/API';
import { bannerPromoSettings } from '@utils/Constants';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Slider from 'react-slick';

const Index = ({
  faqs,
  carousels,
  category,
  categoryParent,
  contentWorkshopTop,
  contentWorkshopMiddle,
  seo,
  titleHeader
}) => {
  const router = useRouter();
  let { id, slug, origin } = router.query;

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [pageInfo, setPageInfo] = useState();
  const [limit, setLimit] = useState(3);
  const [filterActive, setFilterActive] = useState(id);
  const [categories] = useState(category);
  const [faqList, setFaqList] = useState([]);
  const [carouselList, setCarouselList] = useState([]);
  const [loadMoreCount, setLoadMoreCount] = useState(0);

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const handleClickFilter = (filter, index) => {
    setFilterActive(filter);
    setLimit(3);
    router.push(`/pilihan/${slug}/${filter}?origin=otoklix`);
    Helper.moveArrayItemToNewIndex(categories, index, 0);
  };

  const findIndex = () => {
    if (slug !== categoryParent) router.push('/404');
  };

  const fetchWorkshopsList = async () => {
    const reqBody = {
      area: id,
      limit: limit
    };

    setLoading(true);
    await apiServer
      .post('/graphql/listBengkel', reqBody)
      .then((res) => {
        const data = res?.data?.data?.nodes;
        const hasMoreData = res?.data?.data?.pageInfo?.hasNextPage;
        setWorkshops(data);
        setPageInfo(hasMoreData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  const handleLoadMore = () => {
    const count = loadMoreCount + 1;

    amplitude.getInstance().logEvent('load more attempted', {
      load_more_attempt: count,
      page_location: fullPath
    });

    setLoadMoreCount(count);
    setLimit(limit + 3);
  };

  const handleOpenWorkshop = (item) => {
    amplitude.getInstance().logEvent('explore workshop list selected', {
      workshop_id: parseInt(item?.workshopParams?.id),
      workshop_name: item?.title,
      page_location: fullPath
    });

    router.push(`/bengkel/${item?.slug}`);
  };

  useEffect(() => {
    if (faqs !== null) {
      try {
        const parseData = JSON.parse(faqs);
        setFaqList(parseData);
      } catch (e) {
        console.log(e);
      }
    } else {
      setFaqList([]);
    }
  }, [faqs, id]);

  useEffect(() => {
    if (carousels !== null) {
      try {
        const parseData = JSON.parse(carousels);
        setCarouselList(parseData);
      } catch (e) {
        console.log(e);
      }
    } else {
      setCarouselList([]);
    }
  }, [carousels, id]);

  useEffect(() => {
    fetchWorkshopsList();
  }, [limit, id]);

  useEffect(() => {
    findIndex();
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'list curated',
      screen_category: id,
      page_location: fullPath
    });
  }, [id]);

  return (
    <PrivateLayout
      title={seo?.title}
      description={seo?.metaDesc}
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      {origin === 'otoklix' ? (
        <Header
          title={titleHeader}
          className="mt-2"
          onBackClick={() => router.push(`/pilihan/${slug}/?origin=otoklix`)}
        />
      ) : (
        <Header title={titleHeader} />
      )}

      <Container className="home-content">
        <Col>
          <div className="filter mt-3 mb-4">
            <ScrollMenu
              alignCenter={false}
              data={categories?.map((filter, index) => {
                return (
                  <Tags
                    key={index}
                    onClick={() => handleClickFilter(filter?.slug, index)}
                    className="tags"
                    active={filter?.slug == filterActive}
                    size="md"
                    pill
                    color="light"
                    textColor="body"
                    title={filter?.name}
                  />
                );
              })}
            />
          </div>
        </Col>

        <Card className="p-3 mb-4 bengkel-pilihan__content__card-sec br-05">
          <Text tag="h1" color="primary" className="fs-5 fw-bold mb-3">
            {contentWorkshopTop?.h1Title}
          </Text>
          <div dangerouslySetInnerHTML={{ __html: contentWorkshopTop?.description }}></div>
        </Card>

        <Col>
          {workshops?.map((item, index) => {
            const tagsList = item?.tags?.nodes.map((item) => item.name);
            return (
              <div className="pointer" key={index} onClick={() => handleOpenWorkshop(item)}>
                <CardWorkshopExplore
                  className="mb-3 br-05"
                  image={item?.featuredImage?.node?.sourceUrl}
                  isShowTime={item?.workshopParams?.time || false}
                  time={Helper.shortText(item?.workshopParams?.time, 20)}
                  timeIcon={
                    item?.workshopParams?.timeIcon !== null ? item?.workshopParams?.timeIcon : ''
                  }
                  tags={tagsList.slice(0, 6)}
                  isShowDistance={false}
                  isShowOtopoints={false}
                  price={'Rp' + Helper.formatMoney(item?.workshopParams?.price)}
                  rating={0}
                  region={Helper.shortText(item?.workshopParams?.city, 20)}
                  tierImage="https://d3hzenzw88v4gz.cloudfront.net/icon-app/tier-verified.svg"
                  title={Helper.shortText(item?.title, 25)}
                  imgAlt={item?.featuredImage?.node?.altText}
                />
              </div>
            );
          })}

          {pageInfo && !loading ? (
            <Button
              className="mt-4 mb-5 py-2 rounded-pill"
              size="sm"
              color="primary"
              block
              outline
              onClick={handleLoadMore}>
              Load More
            </Button>
          ) : pageInfo && loading ? (
            loader
          ) : null}
        </Col>

        <Card className="my-4 bengkel-pilihan__content__card-sec br-05">
          <CardBody>
            <div dangerouslySetInnerHTML={{ __html: contentWorkshopMiddle }}></div>
          </CardBody>
        </Card>

        {carouselList?.length > 0 && (
          <ContentWrapper
            id="all_promo"
            data-automation="home_all_promo"
            leftPadding
            className="pe-0 px-0 left-slick-container">
            <Row className="m-0">
              <Slider {...bannerPromoSettings}>
                {carouselList.map((item, index) => {
                  return (
                    <Link id={`card_promo_${index}`} href={item?.link} key={index}>
                      <img
                        data-automation={`home_card_promo_${index}`}
                        key={item?.name}
                        src={item?.image}
                        alt={item?.name}
                        className="rounded-1 img-fluid pointer"
                        role="presentation"
                      />
                    </Link>
                  );
                })}
              </Slider>
            </Row>
          </ContentWrapper>
        )}

        <Col>
          <Text tag="h2" color="body" className="text-md fw-semibold">
            Related Search
          </Text>
          {categories?.map((item, index) => {
            return (
              <AccordionButton
                label={item?.name}
                rightIcon="/assets/icons/arrow-right.svg"
                color="body"
                className={index > 0 && 'mt-2'}
                key={index}
                onClick={() => handleClickFilter(item?.slug, index)}
              />
            );
          })}
        </Col>

        <Col className="mt-4">
          <AboutServices
            faqs={faqList}
            openIcon="/assets/icons/arrow-up-orange.svg"
            closeIcon="/assets/icons/arrow-down-orange.svg"
          />
        </Col>
      </Container>
    </PrivateLayout>
  );
};

export default Index;

export async function getServerSideProps({ query }) {
  const { id } = query;

  const [contentWorkshopRes, categoryRes] = await Promise.all([
    fetch(`${process.env.GRAPHQL_URL}`, reqOptions(contentQuery(id))),
    fetch(`${process.env.GRAPHQL_URL}`, reqOptions(categoryQuery(id)))
  ]);

  const [contentWorkshop, categories] = await Promise.all([
    contentWorkshopRes.json(),
    categoryRes.json()
  ]);

  const faqsNew = contentWorkshop?.data?.postBy?.faq?.faqList;
  const carousels = contentWorkshop?.data?.postBy?.carousel?.carouselList;
  const category = categories?.data?.categories?.nodes[0]?.parent?.node?.children?.nodes;
  const categoryParent = categories?.data?.categories?.nodes[0]?.parent?.node?.slug;
  const contentWorkshopTop = contentWorkshop?.data?.postBy?.contentWorkshopTop;
  const contentWorkshopMiddle = contentWorkshop?.data?.postBy?.contentWorkshopMiddle?.content;
  const seo = contentWorkshop?.data?.postBy?.seo;
  const titleHeader = contentWorkshop?.data?.postBy?.title;

  return {
    props: {
      faqs: faqsNew || null,
      carousels: carousels || [],
      category: category || null,
      categoryParent: categoryParent || null,
      contentWorkshopTop: contentWorkshopTop || null,
      contentWorkshopMiddle: contentWorkshopMiddle || null,
      seo: seo || null,
      titleHeader
    }
  };
}
