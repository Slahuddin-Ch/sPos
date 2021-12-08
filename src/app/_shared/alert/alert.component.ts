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
  timeout : any = null;
  // Type: spinner

  ngOnInit() {
    this.subscription = this.alert.getAlert().subscribe(
      (message : any) => { 
        this.message = message; 
        // Hide alert after 3 seconds.
        clearTimeout(this.timeout);
        if(this.message.type==='success' || this.message.type==='error'){
          this.timeout = setTimeout(()=>{
            this.message = {type: '', text: ''}; 
          }, 3000)
        }
      }
    );
  }

  clear(){
    this.message = {type: '', text: ''}
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
