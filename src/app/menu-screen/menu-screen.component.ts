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
  public currentTab : any = 'categories';
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
      name  : ['', [Validators.required]],
      price : [0, [Validators.min(0)]],
      tax   : [0, [Validators.min(0)]],
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

  action(mode : any){
    switch (mode) {
      case 'save':
        this.alert.spinner();
        this.http.newCategory(this.catForm.value).subscribe(
          (res : any) => { this.output.mode = 'view'; this.output.data.push(res); this.alert.success('Category created successfully');},
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
      default:
        break;
    }
  }

}
