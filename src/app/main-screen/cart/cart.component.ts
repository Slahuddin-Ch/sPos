import { Component, OnInit, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterContentChecked {
  @ViewChild('posCartList') private posCartList?: ElementRef;
  public cartList : any = [];
  public total : Number = 0;
  constructor() { }

  ngOnInit() {
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
  scrollCartList(){
    if(this.posCartList){
      var scrollingElement = this.posCartList.nativeElement;
      scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }
  }
  removeFromCart(id : any, index : any){
    let temp = this.cartList;
    temp.splice(index, 1);
    this.cartList = [];
    temp.forEach((item : any) => {
      this.cartList.push(item);
    });
  }
  editCartItem(item : any, index : any){}
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

}
