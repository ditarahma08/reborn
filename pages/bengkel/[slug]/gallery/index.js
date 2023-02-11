import RatingHeader from '@components/gallery/RatingHeader';
import PlainHeader from '@components/header/PlainHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Container, EmptyState } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import FsLightbox from 'fslightbox-react';
import { times } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const Gallery = ({ gallery }) => {
  const router = useRouter();
  const topRef = useRef();

  const [galleryDetail, setGalleryDetail] = useState({});
  const [loadGallery, setLoadGallery] = useState(true);
  const [activeTab, setActiveTab] = useState('front_view');
  const [showLightbox, setShowLightbox] = useState(false);
  const [galleryLightbox, setGalleryLightbox] = useState([]);
  const [isOpenOnMount, setIsOpenOnMount] = useState(false);
  const [lightboxSlide, setLightboxSlide] = useState(0);
  const [galleryFront, setGalleryFront] = useState([]);
  const [galleryInner, setGalleryInner] = useState([]);
  const [galleryFacility, setGalleryFacility] = useState([]);
  const [galleryGroup, setGalleryGroup] = useState('front_view');
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    setLoadGallery(false);
    setGalleryDetail(gallery);
    setGalleryFront(gallery?.images?.front_view);
    setGalleryInner(gallery?.images?.inner_view);
    setGalleryFacility(gallery?.images?.facility);
  }, [gallery]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (scrollToTop) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    return () => (mounted = false);
  }, [scrollToTop]);

  const handleChangeTab = (val) => {
    setActiveTab(val);

    setScrollToTop(true);
    setTimeout(() => {
      setScrollToTop(false);
    }, 2000);
  };

  const handleOpenImage = (section, keyIndex) => {
    let listImage;
    let lightboxImages;

    setIsOpenOnMount(true);
    setGalleryGroup(section);
    setLightboxSlide(keyIndex + 1);

    if (section === 'front_view') {
      listImage = galleryFront?.map((image) => image.image_link);
      lightboxImages = { front_view: listImage };
    } else if (section === 'inner_view') {
      listImage = galleryInner?.map((image) => image.image_link);
      lightboxImages = { inner_view: listImage };
    } else if (section === 'facility') {
      listImage = galleryFacility?.map((image) => image.image_link);
      lightboxImages = { facility: listImage };
    }

    setGalleryLightbox(lightboxImages);
    setShowLightbox(!showLightbox);
  };

  const innerView = galleryInner?.map((item, index) => {
    return (
      <div
        className="img-gallery-wrapper"
        key={index}
        onClick={() => handleOpenImage('inner_view', index)}>
        <img src={item.image_link} className="img-gallery" />
      </div>
    );
  });

  const frontView = galleryFront?.map((item, index) => {
    return (
      <div
        className="img-gallery-wrapper"
        key={index}
        onClick={() => handleOpenImage('front_view', index)}>
        <img src={item.image_link} className="img-gallery" />
      </div>
    );
  });

  const facilityView = galleryFacility?.map((item, index) => {
    return (
      <div
        className="img-gallery-wrapper"
        key={index}
        onClick={() => handleOpenImage('facility', index)}>
        <img src={item.image_link} className="img-gallery" />
      </div>
    );
  });

  const loading = times(4, (item) => <Skeleton key={item} width={'100%'} height={'200px'} />);

  return (
    <PrivateLayout pathName="/" wrapperClassName="wrapper-full">
      <span ref={topRef} />
      <PlainHeader
        title="Galeri Foto"
        icon="/assets/icons/arrow-left-blue.svg"
        iconOnClick={() => router.back()}
      />
      <Container className="mt-2 px-3">
        <RatingHeader
          name={galleryDetail?.name}
          rating={galleryDetail?.rating}
          icon={galleryDetail?.tier?.icon_link}
        />
      </Container>

      <Container className="mb-3 px-3 sticky-top tabs-gallery-wrapper">
        <div className="tabs-gallery d-flex justify-content-between mt-3">
          <div
            className={`tab ${activeTab === 'front_view' ? 'active' : ''}`}
            onClick={() => handleChangeTab('front_view')}>
            <h6 className="label mx-2">Tampak Depan</h6>
          </div>
          <div
            className={`tab ${activeTab === 'inner_view' ? 'active' : ''}`}
            onClick={() => handleChangeTab('inner_view')}>
            <h6 className="label mx-2">Tampak Dalam</h6>
          </div>
          <div
            className={`tab ${activeTab === 'facility' ? 'active' : ''}`}
            onClick={() => handleChangeTab('facility')}>
            <h6 className="label mx-2">Fasilitas</h6>
          </div>
        </div>
      </Container>

      {loadGallery ? (
        <Container className="home-content">{loading}</Container>
      ) : (
        <Container className="home-content">
          {activeTab === 'front_view' &&
            (frontView?.length !== 0 ? (
              frontView
            ) : (
              <EmptyState
                image="/assets/images/location-permission.png"
                imgWidth={200}
                captionAsTitle={true}>
                <div className="warning-promo-message">
                  <p className="fw-bold mb-1 title">Belum Ada Foto</p>
                  <span>Sayang sekali, bengkel ini tidak memiliki foto untuk ditampilkan</span>
                </div>
              </EmptyState>
            ))}

          {activeTab === 'inner_view' &&
            (innerView?.length !== 0 ? (
              innerView
            ) : (
              <EmptyState
                image="/assets/images/location-permission.png"
                imgWidth={200}
                captionAsTitle={true}>
                <div className="warning-promo-message">
                  <p className="fw-bold mb-1 title">Belum Ada Foto</p>
                  <span>Sayang sekali, bengkel ini tidak memiliki foto untuk ditampilkan</span>
                </div>
              </EmptyState>
            ))}

          {activeTab === 'facility' &&
            (facilityView?.length !== 0 ? (
              facilityView
            ) : (
              <EmptyState
                image="/assets/images/location-permission.png"
                imgWidth={200}
                captionAsTitle={true}>
                <div className="warning-promo-message">
                  <p className="fw-bold mb-1 title">Belum Ada Foto</p>
                  <span>Sayang sekali, bengkel ini tidak memiliki foto untuk ditampilkan</span>
                </div>
              </EmptyState>
            ))}
        </Container>
      )}

      <FsLightbox
        toggler={showLightbox}
        sources={galleryLightbox[galleryGroup]}
        type="image"
        openOnMount={isOpenOnMount}
        key={galleryGroup}
        slide={lightboxSlide}
        thumbs={galleryLightbox[galleryGroup]}
        showThumbsOnMount={true}
        showSlideshow={false}
      />
    </PrivateLayout>
  );
};

export default Gallery;

export async function getServerSideProps({ query }) {
  const { slug } = query;

  const [galleryList] = await Promise.all([
    fetch(`${process.env.API_URL}v2/workshops/${slug}/gallery`)
  ]);

  const [galleryData] = await Promise.all([galleryList.json()]);
  const gallery = galleryData?.data ? galleryData?.data : null;

  return {
    props: {
      gallery
    }
  };
}
