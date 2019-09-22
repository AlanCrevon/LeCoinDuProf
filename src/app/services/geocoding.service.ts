import { Injectable } from '@angular/core';
import * as geofirex from 'geofirex';
import * as firebaseApp from 'firebase/app';
import { GeoFireClient } from 'geofirex';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  geo = geofirex.init(firebaseApp);

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
              point: this.geo.point(lat, lng)
            };
            console.log(location);
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
