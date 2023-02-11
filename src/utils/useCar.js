import Helper from '@utils/Helper';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function useCar(user, isAuthenticated) {
  const router = useRouter();
  const [userCar, setUserCar] = useState({});
  const [openModalCar, setOpenModalCar] = useState(false);
  const [firstCheck, setFirstCheck] = useState(false);
  const getUserCar = Cookies.get('user_car', { path: '/' });

  const editCar = (redirectPath, redirectQuery) => {
    if (isAuthenticated) {
      if (redirectPath) {
        router.push({
          pathname: `/mobilku`,
          query: {
            redirectPath,
            redirectQuery: JSON.stringify(redirectQuery)
          }
        });
      } else {
        if (!isEmpty(user?.user_car)) {
          router.push('/mobilku');
        } else {
          setOpenModalCar(true);
        }
      }
    } else {
      setOpenModalCar(true);
    }
  };

  const closeEditCar = () => {
    setOpenModalCar(false);
  };

  useEffect(() => {
    if (isAuthenticated || getUserCar) {
      setUserCar(JSON.parse(getUserCar));
    } else {
      setUserCar({});
    }
    setFirstCheck(true);
  }, [user, getUserCar]);

  let carId,
    carVariantId,
    carPlate,
    carModel,
    carImage,
    carYear,
    carTransmission,
    carName,
    carVariant;
  if (userCar) {
    carId = userCar?.id;
    carVariantId = userCar?.car_details?.id;
    carPlate = Helper.formatLicensePlate(userCar?.license_plate);
    carModel = userCar?.car_details?.car_model?.model_name;
    carImage = userCar?.car_details?.car_model?.image_link;
    carYear = userCar?.year;
    carTransmission = userCar?.transmission;
    carName = userCar?.car_details?.car_model?.brand?.name;
    carVariant = userCar?.car_details?.variant;
  }

  return {
    car: {
      carId,
      carVariantId,
      carPlate,
      carModel,
      carImage,
      carYear,
      carTransmission,
      carName,
      carVariant
    },
    openModalCar,
    editCar,
    closeEditCar,
    firstCheck
  };
}

export default useCar;
