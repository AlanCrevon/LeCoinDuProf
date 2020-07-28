import { GeoPoint, FieldValue } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { AppUser } from './app-user';

export interface Item {
  id?: string;
  name: string;
  owner: string;
  owner$?: Observable<AppUser>;
  box: string;
  description: string;
  category: number;
  isShared: boolean;
  modifiedAt: FieldValue;
  createdAt: FieldValue;
  formatted_address: string;
  coordinates: GeoPoint;
  geohash: string;
  canGive: boolean;
  canLend: boolean;
  canExchange: boolean;
  canSend: boolean;
  hasPicture: boolean;
  picture$?: Observable<string>;
  thumbnail$?: Observable<string>;
}
