import { Component, OnInit } from '@angular/core';
import { HttpService, StorageService, AlertService } from 'src/app/_services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  public filterForm : FormGroup;
  public CATEGORIES : any = [];
  public report : any = {};
  public sum    : any = {total: 0, vat: 0};

  constructor(
    private fb : FormBuilder,
    private alert : AlertService,
    private storage: StorageService,
    private http: HttpService) { 
      this.filterForm = this.fb.group({
        to : [null],
        from: [null],
        method: ['']
      });
      let cats = this.storage.getLocalCategories();
      this.CATEGORIES = (cats && typeof cats==='string') ? JSON.parse(cats) : [];
  }

  ngOnInit() {}

  getReport(){
    this.report = {};
    this.sum    = {total: 0, vat: 0};
    this.alert.spinner('Genrating');
    this.http.getSales(this.filterForm.value).subscribe(
      (res : any) => {
        if(res.length>0){
          res.forEach( (sale : any) => {
            this.handleSale(sale.items);
          });
          console.log(this.report);
        }else{
          this.report = {};
          this.sum    = {total: 0, vat: 0};
        }
        this.alert.clear();
      },
      (err : any) => {this.alert.error(err)}
    );
  }

  handleSale(items : any){
    if(typeof items==='string')
      items = JSON.parse(items);
    if(typeof items==='object'){
      items.forEach( (item : any) => {
        this.handleSaleItem(item);
      });
    }
  }

  handleSaleItem(item : any){
    let category : any = {};
    this.CATEGORIES.every( (cat : any) => {
      if(cat._id === item.cat_id){
        category = cat;
        return false;
      }
      return true;
    });
    let tax : any = 0;
    category.tax = parseFloat(category.tax);
    if(category.tax>0){
      tax = (category.tax===5) ? item.price/21 /* (5% Tax) */ : item.price/6 /* (20% Tax) */;
    }
    if(this.report[item.cat_id]){
      this.report[item.cat_id].total     += parseFloat(item.price);
      this.report[item.cat_id].vat       += parseFloat(tax);
      this.report[item.cat_id].unit_sold += parseFloat(item.qty);
    }else{
      this.report[item.cat_id] = {name : category.name, total: parseFloat(item.price), vat: parseFloat(tax), unit_sold: parseFloat(item.qty)};
    }
    this.sum.total += parseFloat(item.price);
    this.sum.vat   += parseFloat(tax);
  }

  print(value : any, attr : any){ return (value[attr]) ? value[attr] : 0; };
}
