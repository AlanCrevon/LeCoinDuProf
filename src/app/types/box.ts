import { GeoPoint, FieldValue } from '@firebase/firestore-types';

export interface Box {
  name: string;
  owner: string;
  createdAt: FieldValue;
  location: {
    geohash: string;
    geopoint: GeoPoint;
  };
}
