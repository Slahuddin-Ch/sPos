import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceiptService } from 'src/app/_services/receipt.service';

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
  

  constructor(private receipt : ReceiptService, private rendrer : Renderer2) { 
    this.subscription = this.receipt.getReceipt().subscribe(
      (res : any) => {
        this.output = res;
        console.log(res);
        this.items = JSON.parse(this.output.data.items) || [];
        if(this.output.type==='show'){
          this.showModal();
        }else{
          this.hideModal();
        }
      }
    );
  }

  ngAfterViewInit(){}

  showModal(){
    this.rendrer.addClass(this.modal?.nativeElement, 'show');
    this.rendrer.setStyle(this.modal?.nativeElement, 'display', 'block');
  }
  hideModal(){
    this.rendrer.removeClass(this.modal?.nativeElement, 'show');
    this.rendrer.setStyle(this.modal?.nativeElement, 'display', 'none');
    this.output = {type: '', data: null};
    this.items = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
