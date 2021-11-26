import { Component, Output, EventEmitter, ViewChildren, Renderer2, AfterViewInit, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements AfterViewInit {
  @ViewChildren('product') products? : QueryList<ElementRef>;
  @Output() onProductChoose = new EventEmitter<any>();
  constructor(private rendrer : Renderer2) { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    this.products?.toArray().forEach( (product : ElementRef) => {
      this.rendrer.listen(product.nativeElement, 'click', event => {this.addToCart(event)});
    });
  }
  addToCart(event : any){
    const pro    = event.target;
    const data   = pro?.dataset;
    const detail = {
      id : data.index,
      name: data.name,
      price: data.price
    }
    this.onProductChoose.emit(detail);
  }

}
