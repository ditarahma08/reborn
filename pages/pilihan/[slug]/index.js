import { getSEOMeta } from '@actions/SEO';
import FaqCollapse from '@components/collapse/FaqCollapse';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Card,
  CardBody,
  Container,
  ContentWrapper,
  Header,
  Row,
  Tags,
  Text
} from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { apiServer } from '@utils/API';
import { defaultTagsLoad } from '@utils/Constants';
import { bannerPromoSettings } from '@utils/Constants';
import amplitude from 'amplitude-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Slider from 'react-slick';

const PilihanPage = (props) => {
  const router = useRouter();

  const { slug, origin } = router.query;
  const { seo } = props;

  const [titleHeader, setTitleHeader] = useState('');
  const [tags, setTags] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [carouselList, setCarouselList] = useState([]);

  const [contentTop, setContentTop] = useState();
  const [contentMiddle, setContentMiddle] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState('');

  const [showMoreFaq, setShowMoreFaq] = useState(false);

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const fetchContent = async () => {
    const reqBody = {
      slug
    };
    setLoading(true);
    await apiServer
      .post('/graphql/bengkelPilihan', reqBody)
      .then((res) => {
        const data = res?.data?.data;
        const dataTags = data?.categories?.nodes[0]?.children?.nodes;
        const dataFaq = data?.faq?.faqList;
        const dataCarousel = data?.carousel?.carouselList;
        setTitleHeader(data?.title);
        setTags(dataTags);
        setContentTop(data?.contentWorkshopTop);
        setContentMiddle(data?.contentWorkshopMiddle);
        setLoading(false);
        if (dataFaq !== null) {
          try {
            const parseData = JSON.parse(dataFaq);
            setFaqList(parseData);
          } catch (e) {
            console.log(e);
          }
        } else {
          setFaqList([]);
        }
        if (dataCarousel !== null) {
          try {
            const parseData = JSON.parse(dataCarousel);
            setCarouselList(parseData);
          } catch (e) {
            console.log(e);
          }
        } else {
          setCarouselList([]);
        }
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  const handleClickLocationTags = (nextPageSlug) => {
    router.push(`/pilihan/${slug}/${nextPageSlug}/?origin=otoklix`);
  };

  useEffect(() => {
    fetchContent();

    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'curated',
      screen_category: slug,
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    if (seo === null) {
      router.push('/404');
    }
  }, [seo]);

  return (
    <PrivateLayout
      hasAppBar={false}
      wrapperClassName="wrapper-full bg-bg bengkel-pilihan"
      title={seo?.title}
      description={seo?.metaDesc}>
      {origin === 'otoklix' ? (
        <Header title={titleHeader} className="bg-white" onBackClick={() => router.back()} />
      ) : (
        <Header title={titleHeader} className="bg-white" />
      )}

      <ScrollMenu
        className="mt-5"
        alignCenter={false}
        data={
          !loading
            ? tags?.map((item) => {
                return (
                  <div className="mx-2 mt-3" key={item?.slug}>
                    <Tags
                      color="light"
                      textColor="body"
                      pill
                      tag="span"
                      role="button"
                      className="bengkel-pilihan__location-tags"
                      title={item?.name}
                      onClick={() => handleClickLocationTags(item?.slug)}
                    />
                  </div>
                );
              })
            : defaultTagsLoad.map((index) => (
                <Skeleton
                  width={124.67}
                  height={34}
                  className="mt-3 mx-2 rounded-pill mb-0"
                  key={index}
                />
              ))
        }
      />

      <Container className="bengkel-pilihan__content">
        <Card className="mt-3 bengkel-pilihan__content__card-main br-05">
          <CardBody>
            {loading ? <Skeleton height={24} /> : <Text tag="h1">{contentTop?.h1Title}</Text>}
            {loading ? (
              <Skeleton height={100} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: contentTop?.description }}></div>
            )}
          </CardBody>
        </Card>

        <Card className="mt-3 bengkel-pilihan__content__card-sec br-05">
          <CardBody>
            {loading ? (
              <>
                <Skeleton height={24} />
                <Skeleton height={100} />
              </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: contentMiddle?.content }}></div>
            )}
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

        <div className="bengkel-pilihan__faq-container otoklix-footer">
          <Container className="mb-5 faq-section">
            <Row>
              <div className="p-0">
                {faqList?.slice(0, 4).map((faqItem, index) => (
                  <FaqCollapse
                    key={index}
                    item={faqItem}
                    openIcon="/assets/icons/arrow-up-orange.svg"
                    closeIcon="/assets/icons/arrow-down-orange.svg"
                    onClose={selectedFaq?.question === faqItem?.question ? false : true}
                    onClick={() => setSelectedFaq(faqItem)}
                  />
                ))}
              </div>

              {faqList?.length > 4 && (
                <div className="p-0" style={{ display: showMoreFaq ? 'block' : 'none' }}>
                  {faqList?.slice(4, faqList?.length).map((faqItem, index) => (
                    <FaqCollapse
                      key={index}
                      item={faqItem}
                      openIcon="/assets/icons/arrow-up-orange.svg"
                      closeIcon="/assets/icons/arrow-down-orange.svg"
                      onClose={selectedFaq?.question === faqItem?.question ? false : true}
                      onClick={() => setSelectedFaq(faqItem)}
                    />
                  ))}
                </div>
              )}
            </Row>

            {faqList?.length > 4 && !showMoreFaq && (
              <Row className="position-relative">
                <div className="divider-gray" />
                <div className="show-more mb-3" onClick={() => setShowMoreFaq(true)}>
                  Lebih banyak pertanyaan <img src="/assets/icons/arrow-down-gray.svg" />
                </div>
              </Row>
            )}
          </Container>
        </div>
      </Container>
    </PrivateLayout>
  );
};

export default PilihanPage;

export async function getServerSideProps({ query }) {
  const { slug } = query;

  const [seoRes] = await Promise.all([getSEOMeta(slug)]);

  const [seo] = await Promise.all([seoRes]);

  return {
    props: {
      seo: seo ? seo : null
    }
  };
}
