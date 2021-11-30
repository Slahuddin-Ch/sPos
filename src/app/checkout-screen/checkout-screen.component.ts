import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService, StorageService } from '../_services';

@Component({
  selector: 'app-checkout-screen',
  templateUrl: './checkout-screen.component.html',
  styleUrls: ['./checkout-screen.component.css']
})
export class CheckoutScreenComponent implements OnInit {
  public price : any = {state : false, value: 0, mode:'new'};
  public checkout : any = {
    subtotal: 0, 
    discount: 0, 
    total: 0, 
    paid: 0, 
    items: []
  };
  constructor(
    private alert : AlertService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    let items : any = this.storage.getCartList();
    let total : any = this.storage.getTotal();
    this.checkout.items = JSON.parse(items) || [];
    this.checkout.subtotal = JSON.parse(total) || 0;
    this.cdr.detectChanges();
  }

  onPriceChange(amount : any){
    this.price = {state : false, value: amount};
  }
  onDiscountChange(){
    if(this.price.value>100){
      this.alert.error('discount cannot be more than 100%');
      return;
    }
    this.checkout.discount = this.price.value;
    this.price = {state : true, value: 0};
  }
  calculateTotal(){
    const discount = parseInt(this.checkout.discount);
    const subtotal = parseFloat(this.checkout.subtotal);
    if(discount>0){
      let d = (subtotal/100)*discount;
      this.checkout.total = (subtotal-d).toFixed(2);
      return this.checkout.total as any;
    }else{
      this.checkout.total = subtotal;
      return subtotal;
    }
  }
  setPaidAmount(amount : any = null){ 
    if(amount){
      this.checkout.paid  = amount;
    }else{
      this.checkout.paid  = this.price.value;
    }
    this.price = {state : true, value: 0};
  }
  onPayment(mode : any){
    console.log(this.checkout);
    switch (mode) {
      case 'cash':
        this.alert.success('Processed successfully in cash');
        break;
      case 'card':
        this.alert.success('Processed Successfully in card');
        break;
      default:
        break;
    }
    this.checkout = {subtotal:0, total: 0, discount: 0, paid: 0, items: []};
    this.price = {state : true, value: 0};
    this.storage.clearCart();
    this.cdr.detectChanges();
  }
}
