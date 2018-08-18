import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';


import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  QueryFn
} from 'angularfire2/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { map, take, tap, catchError, retry, switchMap, scan } from 'rxjs/operators';
import { Transaction } from '@firebase/firestore-types';





// custom types
type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore) { }


  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  // Return an Observable

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges()
      .pipe(
        map(doc => {
          return doc.payload.data() as T;
        }),
        retry(2),
        catchError(err => of(null))
      );
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges()
      .pipe(
        map(docs => {
          return docs.map(a => a.payload.doc.data()) as T[];
        }),
        retry(2),
        catchError((err) => of([]))
      );
  }

  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as {};
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
        retry(2),
        catchError((err) => of([])),
        // scan((acc, curr: any[]) => curr.length ? curr : acc )
      );
  }

  docWithId$<T>(ref: DocPredicate<T>): Observable<any> {
    return this.doc(ref).snapshotChanges()
      .pipe(
        map(doc => {
          const data = doc.payload.data() as {};
          const id = doc.payload.id;
          return { id, ...data };
        }),
        retry(2),
        catchError(err => of(null))
      );
  }

  keysToDocsArray$<T>(keysCol: CollectionPredicate<T>, docsCol: CollectionPredicate<T>,  keyName: string,  queryFn?) {
    const keys$ = this.col$(keysCol, queryFn).pipe(map((arr) => arr.map(doc => doc[`${keyName}`])));

    const documents$ = keys$.pipe(
      switchMap(keys => {
        return combineLatest(
          keys.map(key => this.doc$(`${docsCol}/${key}`))
        );
      })
    );

    return documents$;
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async update<T>(ref: DocPredicate<T>, data: any) {
    let msg = '';

    try {

      await this.doc(ref).update({
        ...data,
        updatedAt: this.timestamp
      });

      msg = 'update success';

    } catch (e) {

    }
    return msg;
  }

  async  set<T>(ref: DocPredicate<T>, data: any) {
    let msg = '';
    const timestamp = this.timestamp;
    try {
      await this.doc(ref).set({
        ...data,
        updatedAt: timestamp,
        createdAt: timestamp
      });

      msg = 'set successfully';

    } catch (e) {

    }

    return msg;
  }
 async  addDocAt<T>(ref: CollectionPredicate<T>, docId: string, data: any) {
    const timestamp = this.timestamp;

    let msg = '';

    try {
      await  this.col(ref).doc(docId)
      .set({
        ...data,
        updatedAt: timestamp,
        createdAt: timestamp
      });
      msg = 'add successful';

    } catch (e) {

    }
      return msg;
  }

  async add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp;
    let msg = '';

    try {
      await this.col(ref).add({
        ...data,
        updatedAt: timestamp,
        createdAt: timestamp
      });

      msg = 'add sucessfull';

    } catch (e) {

    }

    return msg;
  }

  upsert<T>(ref: DocPredicate<T>, data: any) {
    const doc = this.doc(ref).snapshotChanges()
      .pipe(
        retry(2),
        take(1),
    ).toPromise();

    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    });
  }

  upsertNull<T>(ref: DocPredicate<T>, data: any) {
    const doc = this.doc(ref).snapshotChanges()
      .pipe(
        retry(2),
        take(1),
    ).toPromise();

    return doc.then(snap => {
      return snap.payload.exists ? null : this.set(ref, data);
    });
  }

 async  deleteDoc<T>(ref: DocPredicate<T>) {
    let msg = '';

    try {
      await this.doc(ref).delete();
      msg = 'delete sucessful';

    } catch (e) {

    }

    return msg;
  }

  batch() {
    return firebase.firestore().batch();
  }

 async  transaction(t: (fun: Transaction) => Promise<{}>) {
    let msg = '';

    try {
      await firebase.firestore().runTransaction(t);

      msg =  'transaction success';
    } catch (e) {

    }

    return msg;
  }

  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.doc(ref).snapshotChanges()
      .pipe(
        take(1),
        tap(d => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Document in ${tock}ms`, d);
        })
      ).subscribe();
  }

  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.col(ref).snapshotChanges()
      .pipe(
        take(1),
        tap(c => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Collection in ${tock}ms`, c);
        })
      ).subscribe();
  }

  /// create a reference between two documents
 async  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    let msg = '';
    try {
      await this.doc(host).update({ [key]: this.doc(doc).ref });
      msg = 'refrenced successful';
    } catch (e) {

    }
    return msg;
  }




  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  createUID() {
    return this.afs.createId();
  }


}
