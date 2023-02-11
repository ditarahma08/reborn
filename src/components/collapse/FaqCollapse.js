import { Card, CardBody, Collapse } from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import { useEffect, useState } from 'react';

const FaqCollapse = (props) => {
  const {
    item,
    openIcon = '/assets/icons/chevron-up-secondary.svg',
    closeIcon = '/assets/icons/chevron-down-secondary.svg',
    onClose,
    onClick
  } = props;
  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (question) => {
    onClick(item);
    setIsOpen(!isOpen);
    if (!isOpen) {
      amplitude
        .getInstance()
        .logEvent('faq selected', { faq_title: question, page_location: fullPath });
    }
  };

  useEffect(() => {
    if (onClose) {
      setIsOpen(false);
    }
  }, [onClose]);

  return (
    <Card className="mb-3 border-line faq-collapse" onClick={() => handleOpen(item?.question)}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="title">{item.question}</h3>
          <img src={isOpen ? openIcon : closeIcon} alt="icon_chevron" loading="lazy" />
        </div>

        <Collapse isOpen={isOpen}>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: item.answer }} className="content"></div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default FaqCollapse;
