import React from 'react';

const InputRadio = (props) => {
  const { groupName, options, selected, onChange } = props;
  const handleChange = (e) => {
    const { value } = e.target;
    onChange({
      groupName,
      value
    });
  };

  return (
    <div className="input-radio-container">
      <input
        id={`${groupName}-all`}
        name={groupName}
        type="radio"
        value=""
        checked={selected === ''}
        onChange={handleChange}
      />

      <label className="radio-label" htmlFor={`${groupName}-all`}>
        <div className="flex-grow-1">Semua</div>
        <div className="circle"></div>
        <img className="checkmark" src="/assets/icons/checkmark-blue-lg.svg" />
      </label>

      {options.map((item) => {
        let image_link = item.image_link;
        return (
          <React.Fragment key={item.value}>
            <input
              id={`${groupName}-${item.value}`}
              name={groupName}
              type="radio"
              value={item.value}
              checked={selected == item.value}
              onChange={handleChange}
            />
            <label className="radio-label" htmlFor={`${groupName}-${item.value}`}>
              {item.image_link && <img src={image_link} className="pe-2" />}
              <div className="radio-text">{item.name}</div>
              <div className="circle"></div>
              <img className="checkmark" src="/assets/icons/checkmark-blue-lg.svg" />
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default InputRadio;
