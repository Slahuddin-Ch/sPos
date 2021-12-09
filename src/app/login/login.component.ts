import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService, AlertService, StorageService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form : FormGroup;

  constructor(
    private fb : FormBuilder, 
    private http: HttpService,
    private alert: AlertService,
    private storage: StorageService,
    private route: Router) { 

    this.form = this.fb.group({
      username : ['', [Validators.required]],
      password : ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  loginMe(){
    if(this.form.valid){
      this.alert.spinner();
      this.http.login(this.form.value).subscribe(
        (res : any) => {
          this.storage.saveUser(res);
          this.storage.saveUserToken(res.token);
          this.alert.clear();
          if(res.role==='admin'){
            this.route.navigate(['/admin']);
          }else{
            this.route.navigate(['/']);
          }
        },
        (err : any) => {this.alert.error(err);}
      );
    }
  }

}
