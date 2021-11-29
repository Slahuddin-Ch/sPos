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

  newCategory(data : any) {
    return this.http.post(SERVER_URL + '/category/new', data, OPTIONS);
  }
  getAllCategories() {
    return this.http.get(SERVER_URL + '/category/all', OPTIONS);
  }

}
