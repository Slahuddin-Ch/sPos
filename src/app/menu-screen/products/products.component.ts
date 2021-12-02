import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService, AlertService, StorageService } from '../../_services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public output : any = {data : '', mode: 'view'};
  public productForm : FormGroup;
  public categories : any = [];

  constructor(
    private fb  : FormBuilder,
    private alert: AlertService,
    private http : HttpService,
    private storage: StorageService) { 
      this.productForm = this.fb.group({});
      this.categories = this.storage.getLocalCategories() || [];
      if(typeof this.categories==='string')
        this.categories = JSON.parse(this.categories);
      if(this.categories.length===0){
        this.http.getAllCategories().subscribe(
          (res : any) => {this.categories = res},
          (err : any) => {this.alert.error(err);}
        );
      }
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
      id     : [product?._id    || ''],
      name   : [product?.name   || '', [Validators.required]],
      code   : [product?.code   || '', [Validators.required]],
      cat_id : [product?.cat_id || '', [Validators.required]],
      price  : [product?.price  || null,  [Validators.required, Validators.min(0)]]
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
          (res : any) => { 
            this.output.mode = 'view'; 
            this.output.data.push(res); 
            this.alert.success('Category created successfully');
          },
          (err : any) => {this.alert.error(err);}
        );
        break;

      case 'update':
        this.alert.spinner();
        this.http.updateProduct(this.productForm.value).subscribe(
          (res : any) => { 
            for (let index = 0; index < this.output.data.length; index++) {
              if(this.output.data[index]._id===this.productForm.value.id){
                this.output.data[index] = res;
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
          (res : any) => { 
            this.output.data = res; 
            this.output.mode = 'view'; 
            this.alert.clear()},
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
