import CardCollapse from '@components/collapse/CardCollapse';
import SubHeader from '@components/header/SubHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Container, Header } from '@components/otoklix-elements';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';

sentryBreadcrumb('pages/account/help/index');

const Index = ({ faqs }) => {
  const router = useRouter();

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full">
      <Header onBackClick={() => router.back()} />

      <Container className="wrapper-content border-bottom">
        <SubHeader
          title="Bantuan"
          subtitle={`Terakhir diperbarui ${moment(faqs?.data?.updated_at).format('MMMM YYYY')}`}
          imageLeft="/assets/icons/question-light.svg"
        />
      </Container>
      <Container className="wrapper-content">
        {faqs.data.faqs.map((faqItem, index) => (
          <CardCollapse key={index} item={faqItem} />
        ))}
      </Container>
    </PrivateLayout>
  );
};

export async function getServerSideProps() {
  const faqsRes = await fetch(`${process.env.API_URL}v2/customer_legals/bantuan/faq`);
  const faqs = await faqsRes.json();

  return {
    props: {
      faqs
    }
  };
}

export default Index;
