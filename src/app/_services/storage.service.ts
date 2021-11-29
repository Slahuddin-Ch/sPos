import { Injectable } from '@angular/core';

const CART_ITEMS = 'cart-items';
const CART_TOTAL = 'cart-total';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  getCartList(){ return sessionStorage.getItem(CART_ITEMS)}
  saveCartList(items : any){ sessionStorage.setItem(CART_ITEMS, items)}
  getTotal(){ return sessionStorage.getItem(CART_TOTAL)}
  saveTotal(total : any){sessionStorage.setItem(CART_TOTAL, total);}
  clearCart(){
    sessionStorage.removeItem(CART_ITEMS);
    sessionStorage.removeItem(CART_TOTAL);
  }
}
