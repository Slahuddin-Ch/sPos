import { Component, Input, Output, EventEmitter,OnChanges, ViewChildren, Renderer2, QueryList, ElementRef, SimpleChanges } from '@angular/core';
import { HttpService, AlertService, StorageService } from 'src/app/_services';

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
    private alert : AlertService,
    private http: HttpService,
    private storage: StorageService) { }

  ngOnInit() {
    this.CATEGORIES = this.storage.getLocalCategories();
    if(typeof this.CATEGORIES==='string')
      this.CATEGORIES = JSON.parse(this.CATEGORIES);
    if(typeof this.CATEGORIES!=='object' || this.CATEGORIES?.length===0){
      // Get categories
      this.http.getAllCategories().subscribe(
        (res : any) => {
          this.storage.saveLocalCategories(JSON.stringify(res));
          this.CATEGORIES = res;
        },
        (err : any) => {this.alert.error(err)}
      );
    }
  }
  ngOnChanges(changes : SimpleChanges){
    this.mode = changes.mode.currentValue;
  }

  addToCart(cat : any){
    const detail = {
      cat_id : cat._id,
      name : cat.name,
      tax  : cat.tax
    }
    this.onCategoryChoose.emit(detail);
  }
}
