import { Component, AfterViewInit} from '@angular/core';
import { StorageService } from '../_services';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.css']
})

export class AdminScreenComponent implements AfterViewInit {
  public currentTab : any = 'sales';

  constructor(private storage : StorageService) {}

  ngAfterViewInit() {}

  logout(){
    this.storage.logout();
  }
}
