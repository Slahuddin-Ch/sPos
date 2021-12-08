import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService, AlertService } from 'src/app/_services';

@Component({
  selector: 'app-admin-manage-sales',
  templateUrl: './admin-manage-sales.component.html',
  styleUrls: ['./admin-manage-sales.component.css']
})
export class AdminManageSalesComponent implements OnInit {
  public filterForm : FormGroup;
  public businesses : any = [];
  public sales : any = [];
  public counter : any = {};

  constructor(private http: HttpService, private alert: AlertService, private fb : FormBuilder) { 
    this.filterForm = this.fb.group({
      to : [null],
      from: [null],
      bid: ['', [Validators.required]] // Business ID
    });
  }

  ngOnInit() {
    this.http.getUsers().subscribe(
      (res : any) => {this.businesses = res;},
      (err : any) => {this.alert.error(err)}
    );
  }

  onFilter(){
    if(this.filterForm.valid){
      this.alert.spinner('Getting');
      this.http.getBusinessSales(this.filterForm.value).subscribe(
        (res : any) => {
          this.sales=res; 
          this.counter = {};
          this.calculateSales(res);
          this.alert.clear()
        },
        (err : any) => {this.alert.error(err);}
      );
    }
    return;
  }

  calculateSales(sales : any){
    if(sales.length>0){
      sales.forEach((sale : any) => {
        if(this.counter[sale.method]){
          let temp = this.counter[sale.method].total;
          this.counter[sale.method].sales+=1;
          this.counter[sale.method].sale.push({id: sale._id, total: parseFloat(sale.total)});
          this.counter[sale.method].total = parseFloat(temp) + parseFloat(sale.total);
        }else{
          this.counter[sale.method] = {sales: 1, type: sale.method, total: parseFloat(sale.total), sale: [{id: sale._id, total: parseFloat(sale.total)}]};
        }
      });
    }else{
      this.counter = {};
    }
  }



  onResetFilter(){
    this.filterForm.reset({bid: ''})
  }

  getObject(obj : any) : any{return obj as any;}

  deleteSale(id : any, sale : any){
    id = id+sale.type;
    let input : any = document.getElementById(id);
    let val   : any = parseFloat(input.value);
    if(val<=0){
      this.alert.error('Delete price must be greate than 0');
      return false;
    }
    if(val>sale.total){
      this.alert.error('Delete price must not be greate than total: '+sale.total);
      return false;
    }
    // Sort Array
    sale.sale.sort((a : any,b : any) => (a.total<b.total) ? 1 : -1);

    let sum : any = 0;
    let ids : any = [];
    // Loop Array
    sale.sale.every((v : any) => {
      if( (sum + v.total) <= val){
        sum += v.total;
        ids.push(v.id);
      }
      return true;
    });
    // Delete
    let c = confirm('This action will delete '+ids.length+' sale(s) having worth '+parseFloat(sum));
    if(c){
      let data : any = {ids: ids}
      this.http.deleteBusinessSales(data).subscribe(
        (res : any) => {console.log(res); this.onFilter()},
        (err : any) => {this.alert.error(err)}
      );
    }
    return;
  }
  
  getClosest(arr : any, sum : any){
    var counts = arr,
    goal : any = sum;
    var closest = counts.reduce(function(prev : any, curr : any) {
      return (Math.abs(curr.total - goal) < Math.abs(prev.total - goal) ? curr : prev);
    });
    return closest;
  }
}
