import { FormGroup, FormText, Input, Label } from '@components/otoklix-elements';

function InputField({
  inputType,
  inputName,
  inputPlaceholder,
  inputValue,
  inputInvalid,
  inputLabel,
  inputDisabled,
  errorMessage,
  isRequired,
  dataAutomation,
  onChangeInput
}) {
  return (
    <FormGroup>
      {inputLabel && <Label>{inputLabel}</Label>}
      {isRequired && <span className="text-danger">*</span>}

      <Input
        data-automation={dataAutomation}
        type={inputType}
        name={inputName}
        placeholder={inputPlaceholder}
        value={inputValue}
        disabled={inputDisabled}
        onChange={onChangeInput}
        invalid={inputInvalid}
      />

      {inputInvalid && (
        <FormText>
          <span className="text-danger">{errorMessage}</span>
        </FormText>
      )}
    </FormGroup>
  );
}

export default InputField;
