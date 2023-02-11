import InputGlobalSearch from '@components/input/InputGlobalSearch';
import Row from 'otoklix-elements/lib/components/row/Row';

const SearchHeader = ({
  fullInput,
  sectionLoading,
  inputRef,
  debouncedChangeHandler,
  onClickInput,
  updateInput,
  onKeyUpSearch,
  handleBack
}) => {
  return (
    <Row className="p-0 mx-1">
      <div className="d-flex flex-row pointer pt-3 align-items-center">
        <div
          className="ms-1 me-3 mb-3 back-search-icon"
          style={{ display: fullInput ? 'none' : 'block' }}
          role="presentation"
          onClick={handleBack}
          data-automation="cari_back_button">
          <img src="/assets/icons/arrow-left-thin.svg" alt="arrow-left-thin" loading="lazy" />
        </div>

        <div className="w-100">
          <InputGlobalSearch
            disabled={sectionLoading}
            innerRef={inputRef}
            onChange={debouncedChangeHandler}
            onClick={() => onClickInput()}
            onBlur={() => updateInput(false)}
            onKeyUp={(e) => onKeyUpSearch(e)}
            data-automation="cari_input_search"
            className="border-1"
          />
        </div>
      </div>
    </Row>
  );
};

export default SearchHeader;
