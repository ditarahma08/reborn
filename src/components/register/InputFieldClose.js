import {
  Button,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label
} from '@components/otoklix-elements';

function InputFieldClose({
  inputType,
  inputName,
  inputPlaceholder,
  inputValue,
  inputInvalid,
  inputDisabled,
  inputDesc,
  errorMessage,
  dataAutomation,
  onChangeInput,
  onClose
}) {
  return (
    <FormGroup>
      <InputGroup inputType="relative">
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
          <InputGroupAddon addonType="close">
            <Button close onClick={onClose} />
          </InputGroupAddon>
        )}
      </InputGroup>

      {!inputInvalid && (
        <FormText>
          <Label>{inputDesc}</Label>
        </FormText>
      )}

      {inputInvalid && (
        <FormText>
          <span className="text-danger">{errorMessage}</span>
        </FormText>
      )}
    </FormGroup>
  );
}

export default InputFieldClose;
