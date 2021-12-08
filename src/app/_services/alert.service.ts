import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false; //Either Loader should disappear after route change or not. Default: False

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    this.router.events.subscribe((event : any) => {
      if (event instanceof NavigationStart) {
          if (this.keepAfterRouteChange) {
              // only keep for a single route change
              this.keepAfterRouteChange = false;
          } else {
              // clear alert message
              this.clear();
          }
      }
    });
  }
  /*****************************************************************************
   * Get Alert
   * @returns Observable
  ******************************************************************************/
  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }
  /******************************************************************************
  * Spinner
  * @param message Message Body
  * @param keepAfterRouteChange 
  *******************************************************************************/
  spinner(message: string = '', keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'spinner', text: message });
  }
  /*******************************************************************************
  * Success Alert
  * @param message Message Body
  * @param keepAfterRouteChange
  ********************************************************************************/
  success(message: string = '', keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'success', text: message });
  }
  /*******************************************************************************
  * Error Alert
  * @param message Message Body
  * @param keepAfterRouteChange
  ********************************************************************************/
  error(message: string = '', keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'error', text: message });
  }
  /*******************************************************************************
  * Clear/Close Alert
  ********************************************************************************/
  clear() {
    this.subject.next({ type: 'close', text: '' });
  }

}
