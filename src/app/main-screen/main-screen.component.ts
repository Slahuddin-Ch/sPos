import { Component, OnInit, AfterContentChecked, ViewChild, OnDestroy, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { AlertService, StorageService } from '../_services';
import { Router } from '@angular/router';
import BarcodeScanner from "simple-barcode-scanner";
const scanner = BarcodeScanner();

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('posCartList') private posCartList?: ElementRef;
  @ViewChildren('cartItem') private cartItem?: QueryList<ElementRef>;
  public listeners : any = [];
  public price : any = {state : false, value: 0, mode:'new'};
  public cartList : any = [];
  public total : Number = 0;
  public is_edit : any = {state: false, index: ''};

  constructor(
    private alert: AlertService, 
    private storage: StorageService,
    private rendrer : Renderer2,
    private route: Router) { }
  ngOnInit() {
    let items : any = this.storage.getCartList();
    let total : any = this.storage.getTotal();
    this.cartList = JSON.parse(items) || [];
    this.total    = total || 0;
    scanner.on((code, event) => {
      event.preventDefault();
      console.log(code);
    });
  }
  ngAfterContentChecked(){
    if(this.cartList.length>0){
      let sum : any = 0;
      this.cartList.forEach((item : any) => {
        sum += item.qty*item.price;
      });
      this.total = sum.toFixed(2);
    }else{
      this.total = 0;
    }
    this.scrollCartList();
  }
  onPriceChange(amount : any){
    this.price = {state : false, value: amount, mode: this.price.mode};
  }
  onCategoryChoose(event : any){
    if(this.price===0){
     // this.alert.error('Price Cannot be 0');
     // return;
    }
    let product : any = event;
    product.qty = 1;
    product.price = this.toPound(this.price.value);
    this.price = {state : true, value: 0, mode:'new'};
    this.cartList.push(product);
    this.scrollCartList();
  }
  removeFromCart(id : any, index : any){
    let temp = this.cartList;
    temp.splice(index, 1);
    this.cartList = [];
    temp.forEach((item : any) => {
      this.cartList.push(item);
    });
  }
  editCartItem(index : any){
    const item = this.cartList[index];
    this.is_edit = {state: true, index: index};
    console.log(item.price*100);
    this.price   = {state : false, value: this.toPence(item.price), mode:'edit'};
  }
  editCartItemAction(method : any){
    if(method==='cancel'){
      this.is_edit = {state: false, index: ''};
    }else{
      this.cartList[this.is_edit.index].price = this.toPound(this.price.value);
      this.is_edit = {state: false, index: ''};
    }
    this.price   = {state : true, value: 0, mode:'new'};
  }
  checkout(){
    this.storage.saveCartList(JSON.stringify(this.cartList));
    this.storage.saveTotal(this.total);
    this.route.navigate(['checkout']);
  }
  /*********************************************************************
   * Quantity Counter
   * @param index Index/Id of item
   * @param method (add, minus)
  **********************************************************************/
  changeQuantity(index : any, method : any){
    if(method==='add'){
      this.cartList[index].qty++;
    }else{
      if(this.cartList[index].qty>1)
        this.cartList[index].qty--;
    }
  }

  toPound(val : any){ return (parseInt(val)/100)}
  toPence(val : any){ return parseFloat(val)*100}
  
  scrollCartList(){
    if(this.posCartList){
      var scrollingElement = this.posCartList.nativeElement;
      scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }
  }
  ngOnDestroy(){
    // Remove Bar Code listener
    scanner.off();
  }
}
