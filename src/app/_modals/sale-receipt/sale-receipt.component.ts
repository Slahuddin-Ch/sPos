import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceiptService } from 'src/app/_services/receipt.service';
import { StorageService } from 'src/app/_services';

@Component({
  selector: 'app-sale-receipt',
  templateUrl: './sale-receipt.component.html',
  styleUrls: ['./sale-receipt.component.css']
})
export class SaleReceiptComponent implements AfterViewInit {
  public subscription?: Subscription;
  public output : any = {type: '', data: null};
  public items : any = [];
  @ViewChild('receiptModal') modal? : ElementRef<any>;
  public user : any;
  public settings : any = {};
  public current_date: any = null;
  constructor(private receipt : ReceiptService, private rendrer : Renderer2, private storage: StorageService) { 
    this.user = JSON.parse(this.storage.getUser());
    this.settings =  (this.user) ? this.user.receipt_setting : null;

    this.subscription = this.receipt.getReceipt().subscribe(
      (res : any) => {
        this.user = JSON.parse(this.storage.getUser());
        this.settings = this.user.receipt_setting;

        this.output = res;
        if(typeof this.output.data.items==='string'){
          this.items = JSON.parse(this.output.data.items) || [];
        }else{
          this.items = this.output.data.items;
        }
        if(this.output.type==='show'){
          if(res.data?.created_date){
            this.current_date = res.data?.created_date;
          }else{
            this.current_date = new Date(Date.now());
          }
          this.showModal();
        }else{
          this.current_date = null;
          this.hideModal();
        }
      }
    );
  }

  ngAfterViewInit(){
  }

  showModal(){
    if(this.current_date===null)
      this.current_date = new Date(Date.now());
    this.rendrer.addClass(this.modal?.nativeElement, 'show');
    this.rendrer.setStyle(this.modal?.nativeElement, 'display', 'block');
  }
  hideModal(){
    this.current_date = null;
    this.rendrer.removeClass(this.modal?.nativeElement, 'show');
    this.rendrer.setStyle(this.modal?.nativeElement, 'display', 'none');
    this.output = {type: '', data: null};
    this.items = [];
  }

  printReceipt(){
    if(this.current_date===null)
      this.current_date = new Date(Date.now());
    window.print();
    return;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
