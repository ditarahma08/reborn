import FooterLight from '@components/footer/FooterLight';
import GogoklixBenefit from '@components/gogoklix/GogoklixBenefit';
import GogoklixEmptyState from '@components/gogoklix/GogoklixEmptyState';
import GogoklixMissionCard from '@components/gogoklix/GogoklixMissionCard';
import GogoklixServiceCard from '@components/gogoklix/GogoklixServiceCard';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Col, Container, Row, Text } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

const Gogoklix = () => {
  const { user, token } = useAuth();

  const [isFetching, setIsFetching] = useState(true);
  const [missionList, setMissionList] = useState([]);

  async function fetchMission() {
    authenticateAPI(token);

    try {
      const response = await api.get(`v2/missions/gogoklix`);
      setMissionList(response?.data?.data?.customer_mission_details);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchMission();
  }, []);

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full">
      <Container className="d-flex justify-content-center pt-3 pb-4">
        <img src="/assets/logo/logo.svg" width={85} alt="otoklix-logo" />
      </Container>

      <Container className="gogoklix__header d-flex flex-column align-items-center p-5">
        <Text color="white" className="p-2">
          Hai Selamat Datang
        </Text>
        <Text color="white" weight="bold" className="gogoklix__header-username p-2">
          {user?.name?.split(' ')[0]}
        </Text>
      </Container>

      <Container>
        {!isFetching && (
          <div>
            {!isEmpty(missionList) ? (
              <>
                <div className="p-5 text-center">
                  <h3 className="fw-bold">Misi Kamu</h3>
                </div>
                {missionList?.map((item) => {
                  let monthProgress;

                  if ((item?.mission_details?.name).toLowerCase() === 'cuci mobil') {
                    monthProgress =
                      (item?.current_month_period || '-') + '/' + (item?.total_month_period || '-');
                  } else {
                    monthProgress = false;
                  }

                  return (
                    <React.Fragment key={item.id}>
                      <GogoklixMissionCard
                        hasMonthProgress={monthProgress}
                        title={item?.mission_details?.name}
                        progress={item?.current_progress}
                        target={item?.accomplished_count}
                        missionProgress={item?.current_count}
                        description={item?.mission_details?.description}
                      />
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <GogoklixEmptyState />
            )}
          </div>
        )}
      </Container>

      <Container>
        <div className="gogoklix-service p-5 text-center">
          <Text className="title tagline d-block mb-3">
            JALANI MISINYA,
            <br />
            DAPETIN
            <br />
            KEUNTUNGANNYA
          </Text>
          <Text className="info tagline d-block">
            Otoklix adalah aplikasi booking servis mobil yang memudahkan kamu menemukan bengkel
            terdekat maupun layanan seperti ganti oli, ganti ban, tune-up, hingga cuci mobil.
          </Text>
        </div>

        <Row className="gx-2">
          <Col widths={['base']} base="6" className="d-flex align-items-stretch">
            <GogoklixServiceCard
              icon="/assets/icons/express-wash.svg"
              title="Cuci mobil 3x sebulan"
              info="Dalam 6 bulan berturut-turut"
            />
          </Col>
          <Col widths={['base']} base="6" className="d-flex align-items-stretch">
            <GogoklixServiceCard
              icon="/assets/icons/oli.svg"
              title="Ganti oli 1x (6 bulan)"
              info="Dalam jangka waktu program"
            />
          </Col>
          <Col widths={['base']} base="6" className="d-flex align-items-stretch">
            <GogoklixServiceCard
              icon="/assets/icons/wrench.svg"
              title="Servis 1x (6 bulan)"
              info="Tune up, spooring/balancing, ganti aki. Dalam jangka waktu program"
            />
          </Col>
          <Col widths={['base']} base="6" className="d-flex align-items-stretch">
            <GogoklixServiceCard
              icon="/assets/icons/user-group.svg"
              title="Undang 2 temanmu"
              info="Pastikan mereka juga servis di Otoklix dalam jangka waktu program"
            />
          </Col>
        </Row>
      </Container>

      <GogoklixBenefit />

      <FooterLight />
    </PrivateLayout>
  );
};

export default Gogoklix;
