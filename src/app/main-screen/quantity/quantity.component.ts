import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.css']
})
export class QuantityComponent implements AfterViewInit, OnChanges {
  @ViewChild('input') input? : ElementRef<HTMLInputElement>;
  @ViewChildren('button') buttons? : QueryList<ElementRef>;
  public qty? : Number;
  @Input() state? : boolean;
  @Output() onQtyChange = new EventEmitter<any>();
  constructor(
    private rendrer : Renderer2
  ) { }

  ngOnChanges(changes: SimpleChanges){
    this.state = changes.state.currentValue;
    if(this.state===true){
      this.qty = 1;
      this.input!.nativeElement.value = '0';
    }
  }
  
  ngOnInit() {}
  ngAfterViewInit(){
    this.buttons?.toArray().forEach((btn : ElementRef) => {
        this.rendrer.listen(btn.nativeElement, 'click', event => {
          this.handleQty(event);
        });
    }); 
  }
  handleQty(event : Event){
    const el : any = event.target;
    const val: any = el?.dataset?.val;
    if(val!==''){
      const last_val : any = this.input!.nativeElement.value;
      var int_val : Number = parseInt(last_val+''+val);
      this.input!.nativeElement.value = int_val.toString();
      if(int_val===0) int_val=1;
      this.qty = int_val;
    }else{
      this.input!.nativeElement.value = '';
      this.qty = 1;
    }
    this.onQtyChange.emit(this.qty);
  }
}
