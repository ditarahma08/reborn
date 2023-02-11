import { Card, Text } from '@components/otoklix-elements';

const GogoklixServiceCard = (props) => {
  const { icon, title, info } = props;

  return (
    <Card className="gogoklix-service mb-3 mx-2">
      <div className="mb-1 px-2 py-4 text-center">
        {icon && (
          <div className="mb-3">
            <img src={icon} width="50" height="50" alt="" />
          </div>
        )}
        <Text color="dark" className="title d-block pb-3">
          {title}
        </Text>
        <Text color="secondary" className="info d-block">
          {info}
        </Text>
      </div>
    </Card>
  );
};

export default GogoklixServiceCard;
