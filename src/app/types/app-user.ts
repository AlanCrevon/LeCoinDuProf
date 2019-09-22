import { GeoPoint, FieldValue } from '@firebase/firestore-types';

export interface AppUser {
  displayName: string;
  createdAt: FieldValue;
  location: {
    geohash: string;
    geopoint: GeoPoint;
  };
}
