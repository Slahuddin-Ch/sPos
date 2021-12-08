import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpService, AlertService, StorageService } from 'src/app/_services';

@Component({
  selector: 'app-admin-manage-users',
  templateUrl: './admin-manage-users.component.html',
  styleUrls: ['./admin-manage-users.component.css']
})
export class AdminManageUsersComponent implements OnInit {
  public self : any = null;
  @ViewChild('tableContainer') tableContainer? : ElementRef;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  userForm : FormGroup;
  public users : any = [];

  constructor(private fb : FormBuilder, private http: HttpService, private alert: AlertService, private storage: StorageService) { 
    this.userForm = this.makeUserForm();
    let usr : any = this.storage.getUser();
    this.self = (usr) ? JSON.parse(usr) : null;
  }

  makeUserForm(user : any = null) : FormGroup{
    return this.fb.group({
      /*** @bname User ID */
      id    : [user?._id || ''],
      /*** @bname Business Name */
      bname    : [user?.bname || '', [Validators.required]],
      /*** @bname Business NTN/Registration Number */
      bntn     : [user?.bntn || '', [Validators.required]],
      /*** @email Business/User Eamil */
      email    : [user?.email || '', [Validators.required, Validators.email]],
      /*** @username User's Username */
      username : [user?.username || '', [Validators.required]],
      /*** @password User Password */
      password : [user?.password || '', [Validators.required]],
      /*** @role User Role (user, admin) */
      role     : [user?.role  || 'user', [Validators.required]],
      /*** @status User Status (active, blocked, expired) */
      status   : [user?.status || 'active', [Validators.required]],
      /*** @allowed Number of active users allowed with same account */
      allowed  : [user?.allowed || 1, [Validators.required]], 
    }) as FormGroup;
  }

  ngOnInit() {
   this.alert.spinner('Loading');
   this.http.getUsers().subscribe(
     (res : any) => {
       this.users = res; 
       this.dtTrigger.next();
       this.alert.clear();
      },
     (err : any) => {this.alert.error(err);}
   );
   
  }

  editUser(user : any){
    this.userForm = this.makeUserForm(user);
  }

  updateUser(){
    if(!this.userForm.valid) return false;
    this.alert.spinner('Updaitng');
    this.http.updateUsers(this.userForm.value).subscribe(
      (res : any) => {
        this.users.forEach((user : any) => {
          if(user._id === this.userForm.value.id){
            user.bname = this.userForm.value.bname;
            user.bntn = this.userForm.value.bntn;
            user.email = this.userForm.value.email;
            user.username = this.userForm.value.username;
            user.role = this.userForm.value.role;
            user.status = this.userForm.value.status;
            user.allowed = this.userForm.value.allowed;
            this.dtTrigger.next();
          }
        });
        this.alert.success('User Updated Successfully');
      },
      (err : any) => {this.alert.error(err)}
    );
    return;
  }

  saveUser(){
    if(!this.userForm.valid) return false;
    this.alert.spinner('Saving');
    this.http.register(this.userForm.value).subscribe(
      (res : any) => {
        this.users.push(res);
        this.dtTrigger.next();
        this.userForm.reset({role: 'user', status: 'active', allowed: 1});
        this.alert.success('User Registered Successfully');
      },
      (err : any) => {this.alert.error(err)}
    );
    return true;
  }

  deleteUser(id : any){
    let r = confirm('Are you sure, you want to delete this user?');
    if(r){
      this.alert.spinner('Deleting');
      this.http.deleteUsers(id).subscribe(
        (res : any) => {
          for (let index = 0; index < this.users.length; index++) {
            const user = this.users[index];
            if(user._id === id){
              this.users.splice(index, 1);
              this.dtTrigger.next();
            }
          }
          this.alert.success('Deleted Successfully');
        },
        (err : any) => {this.alert.error(err)}
      );
    }
    return false;
  }

}
