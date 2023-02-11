import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label
} from '@components/otoklix-elements';

const InputSearch = ({ onSearchClick, hasInputClose, ...attributes }) => {
  return (
    <InputGroup inputType="relative">
      <FormGroup className="has-left-icon" floating>
        <InputGroupAddon addonType="prepend">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 14C11.7614 14 14 11.7614 14 9C14 6.23858 11.7614 4 9 4C6.23858 4 4 6.23858 4 9C4 11.7614 6.23858 14 9 14ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
              fill="#A0A3BD"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.5858 12.5858C13.3668 11.8047 14.6332 11.8047 15.4142 12.5858L19.4142 16.5858C20.1953 17.3668 20.1953 18.6332 19.4142 19.4142C18.6332 20.1953 17.3668 20.1953 16.5858 19.4142L12.5858 15.4142C11.8047 14.6332 11.8047 13.3668 12.5858 12.5858Z"
              fill="#A0A3BD"
            />
          </svg>
        </InputGroupAddon>
        <Input placeholder="Cari" onClick={onSearchClick} {...attributes} />
        <Label>Cari</Label>
      </FormGroup>

      {hasInputClose && (
        <InputGroupAddon addonType="close">
          <Button close />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default InputSearch;
