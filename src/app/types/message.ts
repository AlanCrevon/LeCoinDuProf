import { FieldValue } from '@firebase/firestore-types';

export interface Message {
  id?: string;
  content: string;
  author: string;
  createdAt: FieldValue;
}
