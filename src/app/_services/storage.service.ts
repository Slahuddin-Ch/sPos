import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

const CART_ITEMS = 'cart-items';
const CART_TOTAL = 'cart-total';
const USER       = 'curr-user';
const USER_TOKEN = 'curr-user-token';
const CATEGORIES = 'categories';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private user = new Subject<any>();

  constructor(private route: Router) { }

  getUserStatus(): Observable<any> {
    return this.user.asObservable();
  }
  /**********************************************************************
   * User Functions
  ***********************************************************************/
  getUser(){ return sessionStorage.getItem(USER) }
  saveUser(data : any){ 
    sessionStorage.setItem(USER, JSON.stringify(data));
    this.user.next(data);
  }
  getUserToken(){ return sessionStorage.getItem(USER_TOKEN) }
  saveUserToken(token : any){ sessionStorage.setItem(USER_TOKEN, token) }
  logout(){
    sessionStorage.removeItem(USER_TOKEN);
    sessionStorage.removeItem(USER);
    this.clearCart();
    this.clearLocalCategories();
    this.user.next(null);
    this.route.navigate(['/login']);
  }
  /**********************************************************************
   * Cart Functions
  ***********************************************************************/
  getCartList(){ return sessionStorage.getItem(CART_ITEMS)}
  saveCartList(items : any){ sessionStorage.setItem(CART_ITEMS, items)}
  getTotal(){ return sessionStorage.getItem(CART_TOTAL)}
  saveTotal(total : any){sessionStorage.setItem(CART_TOTAL, total);}
  clearCart(){
    sessionStorage.removeItem(CART_ITEMS);
    sessionStorage.removeItem(CART_TOTAL);
  }
  /**********************************************************************
   * Category Functions
  ***********************************************************************/
  getLocalCategories(){ return sessionStorage.getItem(CATEGORIES) || [] }
  saveLocalCategories(cats : any){ sessionStorage.setItem(CATEGORIES, cats) }
  clearLocalCategories(){ sessionStorage.removeItem(CATEGORIES); }
}
