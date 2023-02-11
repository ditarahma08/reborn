import Geocode from 'react-geocode';

export const getAddressLocation = (latitude, longitude, isFormattedAddress = false) => {
  Geocode.setApiKey(process.env.GMAP);

  const address = Geocode.fromLatLng(latitude, longitude).then(
    (response) => {
      let district, city;
      for (let i = 0; i < response.results[0].address_components.length; i++) {
        for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
          switch (response.results[0].address_components[i].types[j]) {
            case 'administrative_area_level_3':
              district = response.results[0].address_components[i].long_name;
              break;
            case 'administrative_area_level_2':
              city = response.results[0].address_components[i].long_name;
              break;
          }
        }
      }

      return {
        lat: latitude,
        lng: longitude,
        address: isFormattedAddress ? response.results[0].formatted_address : `${district}, ${city}`
      };
    },
    (error) => {
      return {
        error: error
      };
    }
  );

  return address;
};
