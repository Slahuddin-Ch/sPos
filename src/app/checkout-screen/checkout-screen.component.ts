import { Component, OnInit } from '@angular/core';
import { AlertService, StorageService } from '../_services';

@Component({
  selector: 'app-checkout-screen',
  templateUrl: './checkout-screen.component.html',
  styleUrls: ['./checkout-screen.component.css']
})
export class CheckoutScreenComponent implements OnInit {
  public price : any = {state : false, value: 0, mode:'new'};
  public checkout : any = {total: 0, discount: 0, paid: 0, items: []};
  constructor(
    private alert : AlertService,
    private storage: StorageService) { }

  ngOnInit() {
    let items : any = this.storage.getCartList();
    let total : any = this.storage.getTotal();
    this.checkout.items = JSON.parse(items) || [];
    this.checkout.total = JSON.parse(total) || 0;
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
    const total    = parseFloat(this.checkout.total);
    if(discount>0){
      let d = (total/100)*discount;
      return (total-d).toFixed(2) as any;
    }else{
      return total;
    }
  }

  onPayment(mode : any){
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
    this.checkout = {total: 0, discount: 0, paid: 0, items: []};
    this.price = {state : true, value: 0};
    this.storage.clearCart();
  }
}
