import { Component, OnInit } from '@angular/core';
import { HttpService, AlertService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReceiptService } from 'src/app/_services/receipt.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  public output : any = {data : '', mode: 'view'};
  public filterForm : FormGroup;

  constructor(
    private fb : FormBuilder,
    private alert: AlertService,
    private receipt: ReceiptService,
    private http : HttpService,) { 
      this.filterForm = this.fb.group({
        to : [null],
        from: [null],
        method: ['']
      });
    }

  ngOnInit() {
    this.alert.spinner('Loading');
    this.http.getSales(this.filterForm.value).subscribe(
      (res : any) => {
        this.output.data = res;
        this.alert.clear();
      },
      (err : any) => {this.alert.error(err)}
    );
  }

  onFilter(){ this.ngOnInit();}

  onResetFilter(){
    this.filterForm.reset({method: ''});
    this.onFilter();
  }

  showReceipt(sale : any){
    this.receipt.show(sale);
  }

}
