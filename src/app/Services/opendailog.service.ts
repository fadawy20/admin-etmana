import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpendailogService {
  private visibleSource = new BehaviorSubject<boolean>(true);
  visible$ = this.visibleSource.asObservable();


  setVisible(visible: boolean) {
    this.visibleSource.next(visible);
  }

  constructor() { }
}
