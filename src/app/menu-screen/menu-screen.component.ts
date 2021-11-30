import { Component, ElementRef, OnInit, ViewChildren, AfterViewInit, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService, AlertService } from '../_services';

@Component({
  selector: 'app-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.css']
})
export class MenuScreenComponent implements OnInit, AfterViewInit {
  @ViewChildren('sidebarLink') links? : QueryList<ElementRef>;
  public currentTab : any = 'products';
  public output : any = {data : '', mode: ''};
  public selected_cat : any = '';
  public catForm : FormGroup;

  constructor(
    private fb  : FormBuilder,
    private alert: AlertService,
    private http : HttpService,
    private rendrer: Renderer2) { 
      this.catForm = this.fb.group({});
    }
  
  catFormGroup(cat : any = null){
    this.catForm =  this.fb.group({
      id    : [cat?._id   || ''],
      name  : [cat?.name  || '', [Validators.required]],
      price : [cat?.price || 0, [Validators.min(0)]],
      tax   : [cat?.tax   || 0, [Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.action('view');
  }
  ngAfterViewInit(){
    this.links?.toArray().forEach((link : ElementRef) => {
      const el = link.nativeElement;
      this.rendrer.listen(el, 'click', event => this.toggleTab(event));
    });
  }
  toggleTab(event : Event){
    const el  = (event.target) as HTMLElement;
    const tab = el.dataset.tab;
    this.links?.toArray().forEach((link : ElementRef) => {
      this.rendrer.removeClass(link.nativeElement, 'active');
    });
    this.rendrer.addClass(el, 'active');
    this.currentTab = tab;
  }

  action(mode : any, param : any = {}){
    switch (mode) {
      case 'save':
        this.alert.spinner();
        this.http.newCategory(this.catForm.value).subscribe(
          (res : any) => { this.output.mode = 'view'; this.output.data.push(res); this.alert.success('Category created successfully');},
          (err : any) => {this.alert.error(err);}
        );
        break;

      case 'update':
        this.alert.spinner();
        this.http.updateCategory(this.catForm.value).subscribe(
          (res : any) => { 
            for (let index = 0; index < this.output.data.length; index++) {
              if(this.output.data[index]._id===this.catForm.value.id){
                this.output.data[index].name  = this.catForm.value.name;
                this.output.data[index].price = this.catForm.value.price;
                this.output.data[index].tax   = this.catForm.value.tax;
              }
            }
            this.output.mode = 'view';
            this.alert.success('Updated successfully');
          },
          (err : any) => {this.alert.error(err);}
        );
        break;
    
      case 'view':
        this.alert.spinner();
        this.http.getAllCategories().subscribe(
          (res : any) => { this.output.data = res; this.output.mode = 'view'; this.alert.clear()},
          (err : any) => { this.alert.error(err) }
        );
        break;

      case 'delete':
        const id = param.id;
        this.alert.spinner();
        this.http.deleteCategory(id).subscribe(
          (res : any) => { 
            for (let index = 0; index < this.output.data.length; index++) {
              if(this.output.data[index]._id===id)
                this.output.data.splice(index, 1);
            }
            this.alert.success('Deleted Successfully');
          },
          (err : any) => { this.alert.error(err) }
        );
        break;
      default:
        break;
    }
  }

}
