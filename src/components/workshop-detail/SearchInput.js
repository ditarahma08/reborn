import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon
} from '@components/otoklix-elements';

const SearchInput = (props) => {
  const { onChange, onFocus } = props;
  return (
    <Container className="filter-wrapper d-flex justify-content-between align-items-center mb-2">
      <InputGroup inputType="relative-sm" className="w-100">
        <FormGroup className="has-left-icon">
          <InputGroupAddon addonType="prepend">
            <img
              src="/assets/icons/search-thin.svg"
              className="mb-2"
              alt="search-thin"
              loading="lazy"
              width="16"
              height="16"
            />
          </InputGroupAddon>

          <Input
            noBorder
            bsSize="md"
            placeholder="Mau servis/perawatan apa?"
            style={{ height: 40 }}
            onChange={onChange}
            onFocus={onFocus}
          />
        </FormGroup>
      </InputGroup>
    </Container>
  );
};
export default SearchInput;
