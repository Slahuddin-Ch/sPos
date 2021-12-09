import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hold-sales',
  templateUrl: './hold-sales.component.html',
  styleUrls: ['./hold-sales.component.css']
})
export class HoldSalesComponent implements OnInit {
  public sales: any = [];
  constructor(private storage: StorageService, private route: Router) { 
    this.sales = this.storage.getHoldSales();
  }

  ngOnInit() {
  }

  goToCart(items : any){
    this.storage.saveCartList(JSON.stringify(items));
    this.route.navigate(['/']);
  }
  removeHoldSale(index : any){
    this.sales = this.storage.removeHoldSale(index);
  }
}
