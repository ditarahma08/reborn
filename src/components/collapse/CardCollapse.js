import { Card, CardBody, Collapse } from '@components/otoklix-elements';
import { useState } from 'react';

const CardCollapse = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-3 bg-off-white border-line" onClick={() => setIsOpen(!isOpen)}>
      <CardBody>
        <div className="d-flex collapse-faq">
          <div className="title">{item.title}</div>
          <div className="ms-auto subtitle">
            <img
              src={isOpen ? '/assets/icons/arrow-up.svg' : '/assets/icons/arrow-down.svg'}
              alt=""
            />
          </div>
        </div>

        <Collapse isOpen={isOpen}>
          <hr />
          <span>{item.content}</span>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default CardCollapse;
