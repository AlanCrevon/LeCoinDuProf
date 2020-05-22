import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn, DocumentChangeAction, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, VirtualTimeScheduler, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DocumentReference } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private angularFirestore: AngularFirestore) {}

  /**
   * Fetch a collection of documents
   * @param path Path of the collection
   * @param queryFn Query function
   */
  getCollection<T>(path: string, queryFn?: QueryFn): Observable<T[]> {
    return this.angularFirestore
      .collection<T>(path, queryFn)
      .snapshotChanges()
      .pipe(
        map(documentChangeActions =>
          documentChangeActions.map(documentChangeAction => {
            // Patch data with id
            const data = documentChangeAction.payload.doc.data();
            const id = documentChangeAction.payload.doc.id;
            return { id, ...data } as T;
          })
        )
      );
  }

  addDocument<T>(collectionPath: string, data: T): Promise<DocumentReference> {
    return this.angularFirestore.collection(collectionPath).add(data);
  }

  getDocument<T>(path: string): Observable<T> {
    return this.angularFirestore
      .doc<T>(path)
      .snapshotChanges()
      .pipe(
        map(documentChangeAction => {
          // Patch data with id
          const data = documentChangeAction.payload.data();
          const id = documentChangeAction.payload.id;
          return { id, ...data } as T;
        })
      );
  }

  setDocument<T>(path: string, data): Promise<void> {
    return this.angularFirestore.doc(path).set(data);
  }

  async updateDocument(path: string, data): Promise<void> {
    return await this.angularFirestore.doc(path).update(data);
  }

  deleteDocument(path: string): Promise<void> {
    return this.angularFirestore.doc(path).delete();
  }
}
