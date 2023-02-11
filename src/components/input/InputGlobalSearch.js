import { FormGroup, Input, InputGroup, InputGroupAddon } from '@components/otoklix-elements';

const InputGlobalSearch = ({ ...attributes }) => {
  return (
    <InputGroup className="input-global-search" inputType="relative-sm">
      <FormGroup className="has-left-icon">
        <InputGroupAddon addonType="prepend">
          <img src="/assets/icons/search-thin.svg" loading="lazy" alt="search-thin" />
        </InputGroupAddon>

        <Input bsSize="sm" placeholder={`Cari kebutuhan mobil saya...`} {...attributes} />
      </FormGroup>
    </InputGroup>
  );
};

export default InputGlobalSearch;
