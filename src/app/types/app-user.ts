import { GeoPoint, FieldValue } from '@firebase/firestore-types';
import { DocumentSnapshot } from '@angular/fire/firestore';

export interface AppUser {
  id?: string;
  displayName: string;
  bio: string;
  createdAt: FieldValue;
  formatted_address: string;
  coordinates: GeoPoint;
  geohash: string;
  doc?: DocumentSnapshot<AppUser>;
  hasPicture: boolean;
}
