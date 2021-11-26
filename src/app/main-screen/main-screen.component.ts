import { Component, OnInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, AfterContentChecked {
  public qty_statue : boolean = false;
  public quantity : Number = 1;
  public cartList : any = [];
  public total : Number = 0;
  constructor() { }
  ngOnInit() {
  }
  ngAfterContentChecked(){
    if(this.cartList.length>0){
      let sum = 0;
      this.cartList.forEach((item : any) => {
        sum += item.qty*item.price;
      });
      this.total = sum;
    }else{
      this.total = 0;
    }
    
  }
  handleQty(event : any){
    this.quantity = parseInt(event);
    this.qty_statue = false;
  }
  handleProduct(event : any){
    let product : any = event;
    product.qty = this.quantity;
    this.quantity = 1;
    this.qty_statue = true;
    let is_exist = false;
    for (let index = 0; index < this.cartList.length; index++) {
      const item = this.cartList[index];
      if(item.id===product.id){
        this.cartList[index].qty +=1;
        is_exist = true;
      }
    }
    if(!is_exist)
      this.cartList.push(product);
  }
  removeFromCart(id : any, index : any){
    this.cartList.splice(index, 1);
  }

}
