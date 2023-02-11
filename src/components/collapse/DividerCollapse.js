import { Row } from '@components/otoklix-elements';

const DividerCollapse = (props) => {
  return (
    <div className="divider-collapse" onClick={props.onCollapse}>
      <Row className="position-relative">
        <div className="divider-gray" />
        <div className="show-more mb-3">
          Lebih banyak pertanyaan <img src="/assets/icons/arrow-down-gray.svg" />
        </div>
      </Row>
    </div>
  );
};

export default DividerCollapse;
