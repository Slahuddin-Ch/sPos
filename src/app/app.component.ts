import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spos';

  constructor(private socket : SocketService){}

  ngOnInit(): void {
      this.socket.connect();
      this.socket.sendMessage();
  }
}
