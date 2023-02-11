import Helper from '@utils/Helper';
import moment from 'moment';

export default class MoEngage {
  static trackEvent(eventName, attributes) {
    if (window !== undefined) {
      window.Moengage.track_event(eventName, attributes);
    }
  }

  static addUserAttributes(userAttributes) {
    const name = userAttributes?.name;
    let firstName = '';
    const lastIndex = name.lastIndexOf(' ');
    if (+lastIndex > 0) {
      firstName = name.substring(0, lastIndex);
    } else {
      firstName = name;
    }

    const mainCarBrand = userAttributes?.user_car?.car_details?.car_model?.brand?.name ?? '';
    const mainCarModel = userAttributes?.user_car?.car_details?.car_model?.model_name ?? '';
    const birtdate = userAttributes?.birthdate
      ? moment(userAttributes?.birthdate).format('YYYY-MM-DD')
      : '';
    const joinDate = userAttributes?.date_joined
      ? moment(userAttributes?.date_joined).format('YYYY-MM-DD')
      : '';
    if (window !== undefined) {
      // Standart Attributes
      window.Moengage.add_first_name(firstName);
      window.Moengage.add_email(userAttributes?.email ? userAttributes?.email : '');
      window.Moengage.add_mobile(userAttributes?.phone_number ? userAttributes?.phone_number : '');
      window.Moengage.add_user_name(userAttributes?.name ? userAttributes?.name : '');
      window.Moengage.add_gender(Helper.getGender(userAttributes?.gender));
      window.Moengage.add_birthday(birtdate);
      // Custom Attributes
      window.Moengage.add_user_attribute('JoinDate', joinDate);
      window.Moengage.add_user_attribute('MainCarBrand', mainCarBrand);
      window.Moengage.add_user_attribute('MainCarModel', mainCarModel);
    }
  }

  static userLoggedIn(id) {
    if (window !== undefined) {
      window.Moengage.add_unique_user_id(id);
    }
  }

  static userLoggetOut() {
    if (window !== undefined) {
      window.Moengage.destroy_session();
    }
  }
}
