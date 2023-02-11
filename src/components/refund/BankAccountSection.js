import OptionsCollapseInput from '@components/collapse/OptionsCollapseInput';
import { ContentWrapper, Icon, Input, Text } from '@components/otoklix-elements';
import BankListBottomsheet from '@components/refund/BankListBottomsheet';
import InputField from '@components/register/InputField';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { useEffect, useState } from 'react';

const BankAccountSection = ({ accounts, onChange, addBank }) => {
  const { user } = useAuth();

  const [showBankForm, setShowBankForm] = useState(false);
  const [openBankList, setOpenBankList] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [activeAccount, setActiveAccount] = useState({});
  const [bankOptions, setBankOptions] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');

  const assignFormattedBankOptions = (banks) => {
    const list = banks?.map((bank) => {
      return {
        id: bank?.id,
        name: bank?.short_name,
        icon: bank?.logo
      };
    });
    setBankOptions(list);
  };

  const fetchBankList = async () => {
    try {
      const response = await api.get('v2/bank/master/');
      assignFormattedBankOptions(response?.data?.data);
    } catch (e) {
      console.log(e);
    }
  };

  const assignActiveAccount = (accounts) => {
    const active = accounts?.find((account) => account?.bank?.is_active == true);
    setActiveAccount(active);
  };

  const handleChangeAccount = (bankSelected) => {
    const accountSelected = accountList?.find((account) => account?.id == bankSelected);
    setActiveAccount(accountSelected);
    setOpenBankList(!openBankList);
    onChange({
      bank_account_number: accountSelected?.account_number,
      bank_account_holder: accountSelected?.account_holder,
      bank_id: accountSelected?.bank?.id
    });
  };

  const handleClearBankInit = () => {
    onChange({
      bank_account_number: '',
      bank_account_holder: '',
      bank_id: ''
    });
  };

  const addAccount = (label, value) => {
    let isNumber;
    if (label === 'bank_account_number') {
      isNumber = checkIsNumber(value);
      setAccountNumber(isNumber);
      addBank(label, isNumber);
    } else {
      addBank(label, value);
    }
  };

  const checkIsNumber = (value) => {
    let newValue = value.replace(/[^0-9+]/g, '');
    newValue = newValue.replace(/(?!^\+)\+/g, '');
    return newValue;
  };

  useEffect(() => {
    user && fetchBankList();
  }, [user]);

  useEffect(() => {
    assignActiveAccount(accounts);
    setAccountList(accounts);
  }, []);

  return (
    <ContentWrapper noBottomMargin title="Dana Refund akan dikembalikan ke:">
      {showBankForm || accountList?.length === 0 ? (
        <>
          <OptionsCollapseInput
            placeholder="Nama Bank"
            options={bankOptions}
            onChange={(option) => addAccount('bank_id', option?.id)}
          />

          <Input
            name="no_rek"
            placeholder="Nomor Rekening"
            value={accountNumber}
            className="mb-3"
            onChange={(e) => addAccount('bank_account_number', e.target.value)}
            data-automation="refund_nomor_rekening"
          />

          <InputField
            inputName="user_name"
            inputType="text"
            inputPlaceholder="Nama Pemilik Rekening"
            onChangeInput={(e) => addAccount('bank_account_holder', e.target.value)}
            data-automation="refund_nama_rekening"
          />
        </>
      ) : (
        <div
          className="d-flex justify-content-between pointer"
          onClick={() => setOpenBankList(!openBankList)}>
          <div className="d-flex">
            {activeAccount?.bank?.logo && (
              <Icon
                card
                textRight
                image={activeAccount?.bank?.logo}
                imageHeight={25}
                imageWidth={25}
                className="me-3"
              />
            )}
            <div className="d-flex flex-column">
              <Text color="label" className="text-xs">
                {activeAccount?.account_holder}
              </Text>
              <Text color="secondary" weight="bold">
                {activeAccount?.account_number}
              </Text>
            </div>
          </div>
          <Icon card image="/assets/icons/arrow-down-gray.svg" imageHeight={15} imageWidth={15} />
        </div>
      )}

      <BankListBottomsheet
        open={openBankList}
        accountList={accountList}
        account={activeAccount}
        onChangeAccount={handleChangeAccount}
        onAddBank={() => {
          setOpenBankList(!openBankList);
          setShowBankForm(true);
          handleClearBankInit();
        }}
        onDismiss={() => setOpenBankList(!openBankList)}
      />
    </ContentWrapper>
  );
};

export default BankAccountSection;
