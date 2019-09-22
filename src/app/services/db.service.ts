import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { DocumentReference } from '@firebase/firestore-types';
import { GeoFirePoint } from 'geofirex';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  geo = geofirex.init(firebaseApp);

  constructor(private angularFirestore: AngularFirestore) {}

  getCollection<T>(path: string, queryFn?: QueryFn): Observable<T[]> {
    return this.angularFirestore
      .collection(path, queryFn)
      .snapshotChanges()
      .pipe(
        map(items => {
          return items.map(item => {
            const data: any = item.payload.doc.data();
            data.id = item.payload.doc.id;
            return data as T;
          });
        })
      );
  }

  getGeoCollection<T>(center: GeoFirePoint, radius: number, field: string, path: string, queryFn?: geofirex.QueryFn) {
    return this.geo
      .collection(path, queryFn)
      .within(center, radius, field)
      .pipe(
        map(items => {
          console.log(items);
        })
      );
  }

  addDocument<T>(collectionPath: string, data: T): Promise<DocumentReference> {
    return this.angularFirestore.collection(collectionPath).add(data);
  }

  getDocument<T>(path: string): Observable<T> {
    return this.angularFirestore.doc<T>(path).valueChanges();
  }

  setDocument<T>(path: string, data): Promise<void> {
    return this.angularFirestore.doc(path).set(data);
  }

  updateDocument(path: string, data): Promise<void> {
    return this.angularFirestore.doc(path).update(data);
  }
}
