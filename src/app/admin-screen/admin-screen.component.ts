import { Component, AfterViewInit} from '@angular/core';
import { StorageService } from '../_services';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.css']
})

export class AdminScreenComponent implements AfterViewInit {
  public currentTab : any = 'dashboard';
  public user : any;

  constructor(private storage : StorageService) {
    let usr : any = this.storage.getUser();
    this.user = JSON.parse(usr);
  }

  ngAfterViewInit() {}

  logout(){
    this.storage.logout();
  }
}
