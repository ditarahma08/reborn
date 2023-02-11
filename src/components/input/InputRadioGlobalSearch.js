import { Icon } from '@components/otoklix-elements';

const InputRadioGlobalSearch = ({
  item,
  title,
  name,
  containerClassname,
  onContainerClick,
  checked,
  ...attributes
}) => {
  return (
    <div
      className={`d-flex align-items-center pointer ${
        containerClassname ? containerClassname : ''
      }`}
      onClick={onContainerClick}>
      <div>
        {title ? (
          title
        ) : item.icon_link ? (
          <Icon
            card
            textRight
            image={item.icon_link}
            title={item.name}
            imageHeight={24}
            imageWidth={24}
          />
        ) : (
          item.name
        )}
      </div>
      <div className="ms-auto text-end">
        <input
          className="form-check-input"
          name={name}
          type="radio"
          checked={checked}
          {...attributes}
        />
      </div>
    </div>
  );
};

export default InputRadioGlobalSearch;
