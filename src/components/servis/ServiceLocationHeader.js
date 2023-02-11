import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon
} from '@components/otoklix-elements';
import Helper from '@utils/Helper';

const ServiceLocationHeader = (props) => {
  const { isAuth, notifCount, onShowSearch, onClickNotif, onSignIn } = props;

  return (
    <>
      <div className="d-flex justify-content-between p-0 mx-0">
        <div className="w-100">
          <InputGroup inputType="relative-sm mt-3">
            <FormGroup className="has-left-icon">
              <InputGroupAddon addonType="prepend">
                <img
                  src="/assets/icons/search-new.svg"
                  alt="icon_search_new"
                  height={24}
                  width={24}
                  loading="eager"
                />
              </InputGroupAddon>
              <Input
                id="input_search"
                data-automation="home_input_search"
                bsSize="sm"
                placeholder="Cari kebutuhan mobilmu"
                className="pointer bg-off-white border border-line br-05"
                readOnly
                onClick={() => onShowSearch()}
              />
            </FormGroup>
          </InputGroup>
        </div>
        <div className="w-20 ml-1">
          {isAuth ? (
            <div className="notification ml-1" onClick={() => onClickNotif()}>
              <img
                src="/assets/icons/notification-new.svg"
                alt="icon_notification_new"
                loading="lazy"
                className="notification-icon mt-4"
              />
              {notifCount > 0 && (
                <span className="badge bg-danger badge-md">{Helper.maxCount99(notifCount)}</span>
              )}
            </div>
          ) : (
            <Button
              data-automation="home_button_masuk"
              className="btn-login"
              size="xs"
              block
              outline
              color="primary"
              onClick={() => onSignIn()}>
              Masuk
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceLocationHeader;
