import FaqCollapse from '@components/collapse/FaqCollapse';
import { Container, ContentWrapper, Row } from '@components/otoklix-elements';
import { useState } from 'react';

const AboutServices = ({ faqs, title, openIcon, closeIcon }) => {
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState('');

  return (
    <ContentWrapper
      leftPadding
      noBottomMargin
      title={<h2>{title}</h2>}
      className="pe-0 px-0 otoklix-footer left-slick-container slick-footer-ptop mb-4">
      <Container className="faq-section">
        <Row>
          <div className="p-0">
            {faqs?.slice(0, 4).map((faqItem, index) => (
              <FaqCollapse
                key={index}
                item={faqItem}
                openIcon={openIcon}
                closeIcon={closeIcon}
                onClose={selectedFaq?.question === faqItem?.question ? false : true}
                onClick={() => setSelectedFaq(faqItem)}
              />
            ))}
          </div>

          {faqs?.length > 4 && (
            <div className="p-0" style={{ display: showMoreFaq ? 'block' : 'none' }}>
              {faqs.slice(4, faqs?.length).map((faqItem, index) => (
                <FaqCollapse
                  key={index}
                  item={faqItem}
                  openIcon={openIcon}
                  closeIcon={closeIcon}
                  onClose={selectedFaq?.question === faqItem?.question ? false : true}
                  onClick={() => setSelectedFaq(faqItem)}
                />
              ))}
            </div>
          )}
        </Row>

        {faqs?.length > 4 && !showMoreFaq && (
          <Row className="position-relative">
            <div className="divider-gray" />
            <div className="show-more mb-3" onClick={() => setShowMoreFaq(true)}>
              Lebih banyak pertanyaan{' '}
              <img src="/assets/icons/arrow-down-gray.svg" alt="arrow-down-gray" loading="lazy" />
            </div>
          </Row>
        )}
      </Container>
    </ContentWrapper>
  );
};

export default AboutServices;
