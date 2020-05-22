import { GeoPoint, FieldValue } from '@firebase/firestore-types';

export interface Box {
  id?: string;
  name: string;
  owner: string;
  createdAt: FieldValue;
  modifiedAt: FieldValue;
  formatted_address: string;
  coordinates: GeoPoint;
  geohash: string;
}
