import { FieldValue } from '@firebase/firestore-types';

export interface FcmToken {
  id?: string;
  token: string;
  os: string;
  browser: string;
  device: string;
  createdAt: FieldValue;
}
