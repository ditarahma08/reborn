import { Text } from '@components/otoklix-elements';

const ButtonSubbar = (props) => {
  const { title, image, imageWidth, imageHeight, imageAlt, className, ...attributes } = props;
  return (
    <div {...attributes} className={`btn-subbar ${className}`} role="button">
      {image && (
        <img src={image} alt={imageAlt} width={imageWidth} height={imageHeight} loading="lazy" />
      )}
      <div className="ms-2">
        <Text className="text-xxs text-truncate" data-automation={`button_display_subbar`}>
          {title}
        </Text>
      </div>
    </div>
  );
};

export default ButtonSubbar;
