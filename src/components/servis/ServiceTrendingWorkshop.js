import { CardRecommendWorkshop, ContentWrapper } from '@components/otoklix-elements';
import WatchImpression from '@components/watch-impression/WatchImpression';
import Link from 'next/link';

const ServiceTrendingWorkshop = (props) => {
  const {
    heightHeader,
    heightFooter,
    widthBlocker,
    trendingWorkshop,
    workshopImpression,
    onClickSubtitle,
    onSetWsImpress,
    onPushWsImpress,
    onClickCard,
    openPopUp
  } = props;

  const href = '/cari?service_category=workshop&sorting=closest&recommendation=true';

  return (
    <ContentWrapper
      data-automation="home_all_recommendation_workshop"
      title="Rekomendasi Bengkel Pilihan"
      dataAutomationSubtitle="home_content_wrapper_lihat_semua_rekomendasi_bengkel"
      dataAutomationTitle="home_content_wrapper_title_rekomendasi_bengkel"
      subtitle={
        <Link href={href} passHref>
          <a href={href}>Lihat Semua</a>
        </Link>
      }
      cardTitleProps={{ tag: 'h2' }}
      subtitleClick={() => onClickSubtitle()}
      className="mt-2 mb-4"
      classNameTitle="title-container"
      classNameSubtitle="subtitle-container">
      <div className="card-service-container home">
        {trendingWorkshop &&
          trendingWorkshop.map((trending, index) => (
            <WatchImpression
              key={index}
              data={trending}
              index={index}
              ratioPush={0}
              primaryKey={trending?.slug}
              style={{ width: 200 }}
              impressions={workshopImpression}
              onChange={onSetWsImpress}
              onPush={onPushWsImpress}
              useInViewOptions={{
                rootMargin: `-${heightHeader}px 0px -${heightFooter}px ${widthBlocker}`,
                threshold: [0, 1]
              }}>
              <CardRecommendWorkshop
                data-automation={`home_recommendation_workshop_${index}`}
                key={trending.slug}
                rating={trending?.rating}
                reviewTotal={trending?.total_review}
                address={trending?.district?.name}
                distance={trending?.distance}
                eta={`(${trending?.eta} menit)`}
                className="pointer card-recommend"
                priceLevel=""
                tags={trending?.service_categories}
                image={trending.image_link}
                title={trending.name}
                onCardClick={() => onClickCard(trending, index)}
                showFlagship={trending?.tier?.name?.includes('Flagship')}
                flagshipIcon={`/assets/icons/${
                  trending?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
                }.svg`}
                isFlagshipPlus={trending?.tier?.name?.toLowerCase() === 'flagship plus'}
                flagshipDetailTarget={() => openPopUp(trending?.tier?.name)}
                dataAutomationRating={`home_recommend_workshop_rating_${index}`}
                dataAutomationReview={`home_recommend_workshop_review_${index}`}
                dataAutomationAddress={`home_recommend_workshop_address_${index}`}
                dataAutomationDistance={`home_recommend_workshop_distance_${index}`}
                dataAutomationFlagship={`home_recommend_workshop_flagship_${index}`}
              />
            </WatchImpression>
          ))}
      </div>
    </ContentWrapper>
  );
};

export default ServiceTrendingWorkshop;
