import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spos';
  public user : any = null;
  constructor(private storage : StorageService, private route: Router){
    /*this.route.events.subscribe(
      (event : any) => {
        switch(true){
          case event instanceof NavigationEnd: {
            if(event.url!==''){
              if(this.user===null){
                this.route.navigate(['login']);
              }
            }
          }
        }
      }
    );*/
  }

  ngOnInit(){
    this.storage.getUserStatus().subscribe(
      (user : any) => {
        this.user = user;
      }
    );
  }
}
