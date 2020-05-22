import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import * as firebase from 'firebase/app';
import Geohash from 'latlon-geohash';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private mapsAPILoader: MapsAPILoader) {}

  getLongLat(inputField, options?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.mapsAPILoader.load().then(() => {
          const autocomplete = new google.maps.places.Autocomplete(inputField, options);
          google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const location = {
              formatted_address: place.formatted_address,
              coordinates: new firebase.firestore.GeoPoint(lat, lng),
              geohash: Geohash.encode(lat, lng)
            };
            resolve(location);
          });
        });
      } catch (error) {
        console.log(error);
        reject('Error while geocoding');
      }
    });
  }
}
