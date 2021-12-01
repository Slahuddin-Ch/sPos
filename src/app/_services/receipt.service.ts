import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private subject = new Subject<any>();
  constructor() { }

  getReceipt(): Observable<any> {
    return this.subject.asObservable();
  }

  show(data : any) {
    this.subject.next({ type: 'show', data: data });
  }
}
