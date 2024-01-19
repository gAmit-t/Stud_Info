import {Dimensions} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export function viewwidth(percentage: number) {
  const value = (percentage * Dimensions.get('window').width) / 100;
  return Math.round(value);
}

export function viewheight(percentage: number) {
  const value = (percentage * Dimensions.get('window').height) / 100;
  return Math.round(value);
}

export const getLocation = (): Promise<Geolocation.GeoPosition> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true, // Whether to use high accuracy mode or not
        timeout: 15000, // Request timeout
        maximumAge: 10000, // How long previous location will be cached
      },
    );
  });
};
