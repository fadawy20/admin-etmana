import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  value: any;
  constructor(private _db: AngularFireDatabase) { }

  getStatus(): Observable<any> {
    this.value = this._db.list('users');
    // this.value = this._db.list('users', ref => ref.orderByChild('updatedDate').startAfter('2023/05/05'));


    return this.value.valueChanges();
  }
}


