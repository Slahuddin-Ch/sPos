import { Component, Input, Output, EventEmitter,OnChanges, ViewChildren, Renderer2, QueryList, ElementRef, SimpleChanges } from '@angular/core';
import { HttpService, AlertService } from 'src/app/_services';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnChanges {
  @ViewChildren('category', {read: ElementRef}) categories? : QueryList<ElementRef>;
  @Output() onCategoryChoose = new EventEmitter<any>();
  @Input() mode : any = 'new'; // [new, edit]
  public CATEGORIES : any = [];

  constructor(
    private rendrer : Renderer2,
    private alert : AlertService,
    private http: HttpService) { }

  ngOnInit() {
    // Get categories
    this.http.getAllCategories().subscribe(
      (res : any) => {
        this.CATEGORIES = res;
        setTimeout(() => {
          this.initEventListner();
        }, 100);
      },
      (err : any) => {this.alert.error(err)}
    );
  }
  ngOnChanges(changes : SimpleChanges){
    this.mode = changes.mode.currentValue;
  }
  initEventListner(){
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
