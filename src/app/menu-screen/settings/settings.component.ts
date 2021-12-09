import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService, AlertService, StorageService } from 'src/app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public pForm: FormGroup;
  public profileForm: FormGroup;
  public receiptForm: FormGroup;
  public user: any;
  public receipt_settings : any = {};

  constructor(private fb: FormBuilder, private alert: AlertService, private http: HttpService, private storage: StorageService) {
    let usr : any = this.storage.getUser();
    this.user = (usr) ? JSON.parse(usr) : null;
    this.receipt_settings = this.user.receipt_setting;
    // Password Form
    this.pForm = this.fb.group({
      cur_pass : ['', [Validators.required]],
      new_pass : ['', [Validators.required]],
      cfn_pass : ['', [Validators.required]]
    },
    { 
      validators: this.password.bind(this)
    });
    // Profile Form
    this.profileForm = this.fb.group({
      bname : [this.user?.bname || '', [Validators.required]],
      bntn: [this.user?.bntn || '', [Validators.required]],
    });
    // Receipt Form
    this.receiptForm = this.fb.group({
      bname :  [this.receipt_settings?.bname || false],
      bntn :   [this.receipt_settings?.bntn || false],
      invoice_no: [this.receipt_settings?.invoice_no || false],
      invoice_date: [this.receipt_settings?.invoice_date || false],
      vat: [this.receipt_settings?.vat || false],
      discount: [this.receipt_settings?.discount || false]
    });
  }

  ngOnInit() {
  }

  password(formGroup: AbstractControl) {
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

  changeReceiptSetting(){
    if(this.receiptForm.valid){
      this.alert.spinner('Updating');
      this.http.updateReceiptSettings(this.receiptForm.value).subscribe(
        (res : any) => {
          let usr = JSON.parse(this.storage.getUser());
          usr.receipt_setting = this.receiptForm.value;
          this.storage.saveUser(usr);
          this.alert.success('Updated Successfully');
        },
        (err : any) => {this.alert.error(err)}
      );
    }
    return;
  }

  changeProfile(){
    if(this.profileForm.valid){
      this.alert.spinner('Updating');
      this.http.updateProfile(this.profileForm.value).subscribe(
        (res : any) => {
          let usr = JSON.parse(this.storage.getUser());
          usr.bname = this.profileForm.value.bname;
          usr.bntn  = this.profileForm.value.bntn;
          this.storage.saveUser(usr);
          this.alert.success('Updated Successfully');
        },
        (err : any) => {this.alert.error(err)}
      );
    }
    return;
  }

}
