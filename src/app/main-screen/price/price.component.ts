import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';


@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements AfterViewInit, OnChanges {
  @ViewChild('input') input? : ElementRef<HTMLInputElement>;
  @ViewChildren('button') buttons? : QueryList<ElementRef>;
  public price? : Number;
  @Input() state? : any;
  @Output() onPriceChange = new EventEmitter<any>();
  constructor(
    private rendrer : Renderer2
  ) { }

  ngOnChanges(changes: SimpleChanges){
    this.state = changes.state.currentValue;
    if(this.state.state===true || this.state.mode==='edit'){
      this.price = this.state.value;
      this.input!.nativeElement.value = ''+this.price;
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
      this.price = int_val;
    }else{
      this.input!.nativeElement.value = '';
      this.price = 0;
    }
    this.onPriceChange.emit(this.price);
  }
}
