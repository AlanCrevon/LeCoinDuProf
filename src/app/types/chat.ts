import { FieldValue } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { Item } from './item';

export interface Chat {
  id?: string;
  participants: any[];
  item: string;
  item$?: Observable<Item>;
  lastMessage: string;
  createdAt: FieldValue;
  modifiedAt: FieldValue;
}
