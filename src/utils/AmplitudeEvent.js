import amplitude from 'amplitude-js';

export default class GtmEvents {
  static track(eventName, properties) {
    amplitude.getInstance().logEvent(eventName, properties);
  }

  static setUserId(value) {
    amplitude.setUserId(value);
  }

  static initial(userId, config) {
    amplitude.getInstance().init(process.env.AMPLITUDE_API_KEY, userId, config);
  }
}
