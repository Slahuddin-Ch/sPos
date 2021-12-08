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
        if(typeof this.output.data.items==='string'){
          this.items = JSON.parse(this.output.data.items) || [];
        }else{
          this.items = this.output.data.items;
        }
        console.log(this.items);
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

  printReceipt(){
    window.print();
    return;
    var prtContent : any = document.getElementById("print_receipt");
    console.log(prtContent.children);
    /*var WinPrint : any = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();*/
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
