import { Button, Container, Icon, Input, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

const BankListBottomsheet = (props) => {
  const { open, accountList, account, onChangeAccount, onDismiss, onAddBank } = props;
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleChangeAccount = (event) => {
    const value = event.target.value;
    setSelectedAccount(value);
    onChangeAccount(value);
  };

  useEffect(() => {
    setSelectedAccount(account?.id);
  }, [account]);

  return (
    <BottomSheet open={open} skipInitialTransition scrollLocking={false} onDismiss={onDismiss}>
      <Container className="p-3 mb-3">
        <Text weight="bold">Bank</Text>

        {accountList?.map((account, index) => (
          <Container
            className="d-flex justify-content-between mt-3"
            key={`${account?.bank?.name}-${index}`}>
            <div className="d-flex align-items-center">
              {account?.bank?.logo && (
                <Icon
                  card
                  textRight
                  image={account?.bank?.logo}
                  imageHeight={25}
                  imageWidth={25}
                  className="me-3"
                />
              )}
              <div className="d-flex flex-column">
                <Text color="label" className="text-xs">
                  {account?.account_holder}
                </Text>
                <Text color="secondary" weight="bold">
                  {account?.account_number}
                </Text>
              </div>
            </div>

            <Input
              type="radio"
              value={account?.id}
              className="input-radio shadow-none-radio refund-bank__radio-options"
              checked={selectedAccount === account?.id}
              onChange={handleChangeAccount}
            />
          </Container>
        ))}

        <Button
          outline
          block
          size="sm"
          className="mt-4 refund-bank__button-add-bank"
          onClick={onAddBank}>
          Tambah Akun Bank
        </Button>
      </Container>
    </BottomSheet>
  );
};

export default BankListBottomsheet;
