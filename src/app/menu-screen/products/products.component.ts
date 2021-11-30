import { Component, ElementRef, OnInit, ViewChildren, AfterViewInit, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService, AlertService } from '../../_services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public output : any = {data : '', mode: 'view'};
  public productForm : FormGroup;

  constructor(
    private fb  : FormBuilder,
    private alert: AlertService,
    private http : HttpService,
    private rendrer: Renderer2) { 
      this.productForm = this.fb.group({});
  }

  ngOnInit() {
    this.action('get');
  }
  /********************************************************************************
   * Make Product (Add/Edit) Form
   * @param product Product Data (Default: Null) 
  *********************************************************************************/
  productFormGroup(product : any = null){
    this.productForm =  this.fb.group({
      id    : [product?._id   || ''],
      name  : [product?.name  || '', [Validators.required]],
      code  : [product?.code  || '', [Validators.required]],
      price : [product?.price || 0, [Validators.min(0)]],
      tax   : [product?.tax   || 0, [Validators.min(0)]],
    });
  }
  /********************************************************************************
   * Action Function
   * @param mode [get, update, add, remove]
   * @param param Parameters (Optional)
  *********************************************************************************/
  action(mode : any, param : any = {}){
    switch (mode) {
      case 'add':
        this.alert.spinner();
        this.http.newProduct(this.productForm.value).subscribe(
          (res : any) => { this.output.mode = 'view'; this.output.data.push(res); this.alert.success('Category created successfully');},
          (err : any) => {this.alert.error(err);}
        );
        break;

      case 'update':
        this.alert.spinner();
        this.http.updateProduct(this.productForm.value).subscribe(
          (res : any) => { 
            for (let index = 0; index < this.output.data.length; index++) {
              if(this.output.data[index]._id===this.productForm.value.id){
                this.output.data[index].name  = this.productForm.value.name;
                this.output.data[index].code  = this.productForm.value.code;
                this.output.data[index].price = this.productForm.value.price;
                this.output.data[index].tax   = this.productForm.value.tax;
              }
            }
            this.output.mode = 'view';
            this.alert.success('Updated successfully');
          },
          (err : any) => {this.alert.error(err);}
        );
        break;
    
      case 'get':
        this.alert.spinner();
        this.http.getAllProducts().subscribe(
          (res : any) => { this.output.data = res; this.output.mode = 'view'; this.alert.clear()},
          (err : any) => { this.alert.error(err) }
        );
        break;

      case 'remove':
        const id = param.id;
        this.alert.spinner();
        this.http.deleteProduct(id).subscribe(
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
