import DatePicker from '@components/datepicker/DatePicker';
import PrivateLayout from '@components/layouts/PrivateLayout';
import HistoryList from '@components/list/HistoryList';
import {
  AbsoluteWrapper,
  Button,
  Container,
  Divider,
  FormGroup,
  Header,
  Input,
  Label,
  Modal,
  Spinner
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { OtoPointsDateFilter } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import { assign, unset } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';

sentryBreadcrumb('pages/otopoints/index');

const OtoPointsPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [otopoints, setPoints] = useState([]);
  const [transactionTypeList, setTransactionTypeList] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [firstFetch, setFirstFetch] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const [hasOpenFilter, setOpenFilter] = useState(false);
  const [filterType, setFilterType] = useState('Pilih Tanggal');
  const [activeFilter, setActiveFilter] = useState(1);
  const [transactionType, setTransactionType] = useState('all');
  const [hasDateModal, setDateModal] = useState(false);
  const [hasDateInput, setShowDateInput] = useState(false);
  const [currentDateInput, setCurrentDateInput] = useState('start');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [hasValidDate, setValidDate] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [currentDateTitle, setCurrentDateTitle] = useState(OtoPointsDateFilter[0].name);
  const [currentTransactionTitle, setCurrentTransactionTitle] = useState('OtoPoints Masuk');

  const handleOpenFilter = (type) => {
    setFilterType(type);
    setOpenFilter(!hasOpenFilter);
  };

  const onChangeFilter = (e) => {
    setActiveFilter(Number(e.target.value));

    if (Number(e.target.value) === 4) {
      setShowDateInput(true);
    } else {
      setShowDateInput(false);
    }
  };

  const handleOpenDateModal = (type) => {
    setDateModal(!hasDateModal);
    setCurrentDateInput(type);
  };

  const handleOnNextDate = (value) => {
    if (currentDateInput === 'start') {
      setStartDate(value);

      if (moment(endDate).diff(value, 'days') < 0) {
        setValidDate(false);
        setDisableSubmit(true);
      } else {
        setValidDate(true);
        setDisableSubmit(false);
      }
    }

    if (currentDateInput === 'finish') {
      setEndDate(value);

      if (moment(value).diff(startDate, 'days') < 0) {
        setValidDate(false);
        setDisableSubmit(true);
      } else {
        setValidDate(true);
        setDisableSubmit(false);
      }
    }

    setDateModal(false);
  };

  const onChangeTransactionFilter = (e) => {
    setTransactionType(e.target.value);
  };

  const setDateTitle = () => {
    setCurrentDateTitle(OtoPointsDateFilter.find((x) => x.value === activeFilter).name);
  };

  const setTransactionTitle = () => {
    setCurrentTransactionTitle(
      transactionTypeList.length > 0
        ? transactionTypeList.find((x) => x.value === transactionType).name
        : 'Semua Transaksi'
    );
  };

  const onReset = () => {
    if (filterType === 'Pilih Tanggal') {
      setActiveFilter(1);
      setCurrentDateTitle(OtoPointsDateFilter.find((x) => x.value === 1).name);
      setShowDateInput(false);
      setStartDate(new Date());
      setEndDate(new Date());
      setValidDate(true);
    }

    if (filterType === 'Pilih Tipe Transaksi') {
      setTransactionType('all');
      setCurrentTransactionTitle(
        transactionTypeList.length > 0
          ? transactionTypeList.find((x) => x.value === 'all').name
          : 'Semua Transaksi'
      );
    }
  };

  const onSubmit = () => {
    let params = {
      transaction_type: transactionType
    };
    if (activeFilter !== 4) {
      if (activeFilter !== 1) {
        assign(params, {
          date: moment()
            .subtract(activeFilter === 2 ? 30 : 90, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
        });
      }

      if (activeFilter === 1) {
        if (params.date) {
          unset(params, 'date');
        }
      }
    }

    if (activeFilter === 4) {
      assign(params, {
        start_date: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
        end_date: moment(endDate).format('YYYY-MM-DD HH:mm:ss')
      });
    } else {
      unset(params, ['start_date', 'end_date']);
    }

    if (filterType === 'Pilih Tanggal') {
      setDateTitle();
    }

    if (filterType === 'Pilih Tipe Transaksi') {
      setTransactionTitle();
    }

    setOpenFilter(false);
    fetchLoyalty(params);
  };

  const fetchLoyalty = async (params) => {
    api.get('v2/loyalty/', { params }).then((res) => {
      setLoading(false);
      setFirstFetch(firstFetch + 1);
      setTransaction(res.data.data.transaction_history);
      setPoints(res.data.data.total_point);
    });
  };

  const fetchLoyaltyFiter = async () => {
    api.get('v2/loyalty/transaction-filter/').then((res) => {
      setTransactionTypeList(res.data.data.transaction_type);
    });
  };

  useEffect(() => {
    authenticateAPI(token);
    fetchLoyalty();
    fetchLoyaltyFiter();
  }, []);

  useEffect(() => {
    setTransactionTitle();
  }, [transactionTypeList]);

  useEffect(() => {
    onSubmit();
  }, [currentDateTitle, currentTransactionTitle]);

  const noData = (
    <Container className="content-wrapper mt-5 text-center">
      <img
        src="/assets/images/clock-sand.png"
        alt=""
        className="d-block m-auto mb-4"
        style={{ width: 150, height: 150 }}
      />
      <div className="mb-4">
        <span className="fs-6 fw-semi-bold">
          {firstFetch > 1 ? 'Yahh nggak ada datanya nih' : 'Yaah, masih kosong nih'}
        </span>

        <br />

        <span className="fs-9 mt-1" style={{ fontSize: 12 }}>
          Transaksi sekarang yuk buat kumpulin OtoPoints
        </span>
      </div>

      {firstFetch <= 1 && (
        <Button
          className="mt-1"
          color="secondary"
          block={false}
          onClick={() => router.push('/bengkel')}>
          Mulai Transaksi
        </Button>
      )}
    </Container>
  );

  const loading = (color = 'primary') => (
    <div className="d-flex justify-content-center p-3">
      <Spinner color={color} />
    </div>
  );

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full otopoints-page">
      <Header title="OtoPoints" onBackClick={() => router.back()} />

      {/* otopoints box */}
      <div className="d-flex justify-content-center otopoints-bg">
        <img src="/assets/icons/otopoints-bg.svg" className="position-absolute start-0" alt="" />
        <img src="/assets/icons/otopoints-bg.svg" className="position-absolute end-0" alt="" />
        <div className="d-flex flex-column text-center">
          <span className="fs-9 mb-2">Total OtoPoints:</span>
          <div className="d-flex align-items-center mt-1">
            {isLoading ? (
              <div className="d-block m-auto">{loading('secondary')}</div>
            ) : (
              <>
                <img className="me-1 big-coin" src="/assets/images/bigcoin.png" alt="" />
                <span className="fs-4 fw-semi-bold">{`${Helper.formatMoney(
                  otopoints
                )} Points`}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* tab head */}
      <div className="text-center py-3 tab">
        <span className="fs-8 fw-semi-bold w-100">Riwayat</span>
      </div>

      {/* filter section */}
      <Container className="content-wrapper">
        <div className="d-flex mt-4 filter-section">
          <div
            className="d-flex align-items-center border border-1 rounded px-2 p-2 cursor-pointer me-2"
            onClick={() => handleOpenFilter('Pilih Tanggal')}>
            <span className="me-2">{currentDateTitle}</span>

            <img src="/assets/icons/chevron-down.svg" alt="" className="ms-1" />
          </div>

          <div
            className="d-flex align-items-center border border-1 rounded px-2 p-2 cursor-pointer"
            onClick={() => handleOpenFilter('Pilih Tipe Transaksi')}>
            <span className="me-2">{currentTransactionTitle}</span>

            <img src="/assets/icons/chevron-down.svg" alt="" className="ms-1" />
          </div>
        </div>
      </Container>

      {isLoading ? (
        loading()
      ) : transaction.length > 0 ? (
        <Container className="content-wrapper mt-4">
          <Scrollbars autoHide autoHeight autoHeightMin={'calc(100vh - 146px)'} universal={true}>
            {transaction.map((item, index) => (
              <div key={index}>
                <HistoryList listItems={item} />
                {index !== index.length && <Divider />}
              </div>
            ))}
          </Scrollbars>
        </Container>
      ) : (
        noData
      )}

      <BottomSheet
        open={hasOpenFilter}
        onDismiss={() => setOpenFilter(!hasOpenFilter)}
        snapPoints={({ minHeight }) => [minHeight + 100]}
        sibling={
          <Modal className="real-modal" isOpen={hasDateModal} centered>
            <Container className="d-flex justify-content-center align-items-center p-3 modal-datetime">
              <DatePicker
                onNext={handleOnNextDate}
                value={currentDateInput === 'start' ? startDate : endDate}
              />
            </Container>
          </Modal>
        }
        blocking={false}>
        <Container className="content-wrapper pb-3 fs-7 px-3">
          <div className="d-flex justify-content-between mb-3">
            <span className="fw-bold text-dark">Filter</span>

            <span className="fw-bold text-muted pointer" onClick={onReset}>
              Reset
            </span>
          </div>

          <div className="mt-1 d-flex flex-column">
            <span className="fw-bold text-secondary">{filterType}</span>

            {/* filter date section */}
            {filterType === 'Pilih Tanggal' && (
              <>
                {OtoPointsDateFilter.map((filterItem, index) => {
                  if (filterItem?.name !== 'Pilih Tanggal Sendiri')
                    return (
                      <FormGroup key={index} className="mt-2 mb-1 p-0" check>
                        <Label className="d-flex justify-content-between" check>
                          {filterItem?.name}
                          <Input
                            defaultChecked={filterItem?.value === activeFilter}
                            className="input-radio me-2"
                            type="radio"
                            name="selectservice"
                            value={filterItem?.value}
                            checked={filterItem?.value === activeFilter}
                            onClick={onChangeFilter}
                          />
                        </Label>
                      </FormGroup>
                    );
                })}

                {hasDateInput && (
                  <>
                    <div className="pilih-tanggal-sendiri d-flex mt-3 row row-cols-2">
                      <div className="d-flex flex-column">
                        <label htmlFor="start-date">Mulai:</label>
                        <span
                          id="start-date"
                          className={!hasValidDate && 'text-danger'}
                          onClick={() => handleOpenDateModal('start')}>
                          {moment(startDate).format('DD MMM YYYY')}
                        </span>
                      </div>
                      <div className="d-flex flex-column">
                        <label htmlFor="end-date">Selesai:</label>
                        <span
                          id="end-date"
                          className={!hasValidDate && 'text-danger'}
                          onClick={() => handleOpenDateModal('finish')}>
                          {moment(endDate).format('DD MMM YYYY')}
                        </span>
                      </div>
                    </div>
                    {!hasValidDate && (
                      <span className="pt-3 text-danger fw-bold">
                        Tanggal Mulai Tidak Boleh Lebih Dari Tanggal Selesai
                      </span>
                    )}
                  </>
                )}
              </>
            )}

            {/* filter transaction section */}
            {filterType === 'Pilih Tipe Transaksi' &&
              transactionTypeList.map((filterItem, index) => (
                <FormGroup key={index} className="mt-2 mb-1 p-0" check>
                  <Label className="d-flex justify-content-between" check>
                    {filterItem?.name}
                    <Input
                      defaultChecked={filterItem?.value === transactionType}
                      className="input-radio me-2"
                      type="radio"
                      name="selectservice"
                      value={filterItem?.value}
                      checked={filterItem?.value === transactionType}
                      onClick={onChangeTransactionFilter}
                    />
                  </Label>
                </FormGroup>
              ))}
          </div>
        </Container>

        <AbsoluteWrapper bottom block>
          <Button color="primary" block onClick={onSubmit} disabled={disableSubmit}>
            Terapkan
          </Button>
        </AbsoluteWrapper>
      </BottomSheet>
    </PrivateLayout>
  );
};

export default OtoPointsPage;
