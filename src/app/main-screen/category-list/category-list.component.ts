import { Component, Input, Output, EventEmitter,OnChanges, ViewChildren, Renderer2, AfterViewInit, QueryList, ElementRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements AfterViewInit, OnChanges {
  @ViewChildren('category') categories? : QueryList<ElementRef>;
  @Output() onCategoryChoose = new EventEmitter<any>();
  @Input() mode : any = 'new'; // [new, edit]

  constructor(private rendrer : Renderer2) { }

  ngOnInit() {
  }
  ngOnChanges(changes : SimpleChanges){
    this.mode = changes.mode.currentValue;
  }
  ngAfterViewInit(){
    this.categories?.toArray().forEach( (category : ElementRef) => {
      this.rendrer.listen(category.nativeElement, 'click', event => {this.addToCart(event)});
    });
  }
  addToCart(event : any){
    const cat    = event.target;
    const data   = cat?.dataset;
    const detail = {
      id : data.index,
      name: data.name,
      price: data.price
    }
    this.onCategoryChoose.emit(detail);
  }

}
