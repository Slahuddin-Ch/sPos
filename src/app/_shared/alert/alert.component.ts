import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  private subscription?: Subscription;
  constructor(private alert : AlertService) { }
  public message: any = {type: '', text: ''}; 
  // Type: spinner

  ngOnInit() {
    this.subscription = this.alert.getAlert().subscribe(
      (message : any) => { this.message = message; }
    );
  }

  clear(){
    this.message = {type: '', text: ''}
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
