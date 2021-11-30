import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const SERVER_URL = 'http://localhost:3003';
const OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }
  
  login(data : any){
    return this.http.post(SERVER_URL + '/user/login', data, OPTIONS);
  }
  /********************************************************************************
   * Category Functions
  *********************************************************************************/
  newCategory(data : any) {
    return this.http.post(SERVER_URL + '/category/new', data, OPTIONS);
  }
  getAllCategories() {
    return this.http.get(SERVER_URL + '/category/all', OPTIONS);
  }
  updateCategory(data : any) {
    return this.http.put(SERVER_URL + '/category/update', data, OPTIONS);
  }
  deleteCategory(id : any){
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(SERVER_URL+'/category/remove', {params : params, headers : OPTIONS.headers});
  }
  /********************************************************************************
   * Product Functions
  *********************************************************************************/
  newProduct(data : any) {
    return this.http.post(SERVER_URL + '/products/new', data, OPTIONS);
  }
  getAllProducts() {
    return this.http.get(SERVER_URL + '/products/all', OPTIONS);
  }
  findOneProduct(barcode : any) {
    let params = new HttpParams();
    params = params.append('barcode', barcode);
    return this.http.get(SERVER_URL+'/products/one', {params : params, headers : OPTIONS.headers});
  }
  updateProduct(data : any) {
    return this.http.put(SERVER_URL + '/products/update', data, OPTIONS);
  }
  deleteProduct(id : any){
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(SERVER_URL+'/products/remove', {params : params, headers : OPTIONS.headers});
  }
}
