import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService, AlertService, HttpService } from 'src/app/_services';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  public self : any;
  public pForm: FormGroup;

  constructor(private storage : StorageService, private fb: FormBuilder, private alert: AlertService, private http: HttpService) { 
    let usr : any = this.storage.getUser();
    this.self = (usr) ? JSON.parse(usr) : null;

    this.pForm = this.fb.group({
      cur_pass : ['', [Validators.required]],
      new_pass : ['', [Validators.required]],
      cfn_pass : ['', [Validators.required]]
    },
    { 
      validators: this.password.bind(this)
    });
  }

  ngOnInit() {
  }

  password(formGroup: FormGroup) {
    const password = formGroup.get('new_pass');
    const confirmPassword = formGroup.get('cfn_pass');
    return password?.value === confirmPassword?.value ? null : { passwordNotMatch: true };
  }

  changePassword(){
    if(this.pForm.valid){
      this.alert.spinner('Updating');
      this.http.updatePassword(this.pForm.value).subscribe(
        (res : any) => {
          this.pForm.reset(); 
          this.alert.success('Passowrd Updated successfully');},
        (err : any) => {this.alert.error(err)}
      );
    }
    return;
  }

}
