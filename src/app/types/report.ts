import { FieldValue } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { Item } from './item';

export interface Chat {
  id?: string;
  author: string;
  item: string;
  item$?: Observable<Item>;
  content: string;
  comment: string;
  status: 'open' | 'closed';
  createdAt: FieldValue;
  modifiedAt: FieldValue;
}
