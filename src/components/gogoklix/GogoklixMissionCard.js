import { Card, Tags, Text } from '@components/otoklix-elements';

const GogoklixMissionCard = ({
  hasMonthProgress,
  title,
  progress,
  missionProgress,
  target,
  description
}) => {
  return (
    <Card className="gogoklix-mission border-0 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Text color="secondary" className="title">
          {title}
        </Text>
        {hasMonthProgress && (
          <Tags
            color="primary"
            pill
            size="sm"
            tag="span"
            title={`Bulan ${hasMonthProgress}`}
            className="specialization-tags"
          />
        )}
      </div>
      <Text color="label" className="info">
        {description || '-'}
      </Text>
      <div className="progress my-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: progress?.toString() + '%' || '0px' }}></div>
      </div>
      <div>
        <Text color="primary" className="service-count">
          {missionProgress || 0}x{' '}
          {title?.toLowerCase() === 'refferal' ? 'orang undangan' : title?.toLowerCase()}
        </Text>{' '}
        <Text color="label" className="info">
          dari {target || 0}x{' '}
          {title?.toLowerCase() === 'refferal' ? 'orang undangan' : title?.toLowerCase()}
        </Text>
      </div>
    </Card>
  );
};

export default GogoklixMissionCard;
