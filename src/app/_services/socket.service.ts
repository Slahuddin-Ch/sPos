import { Injectable} from '@angular/core';
import io from 'socket.io-client';
import { StorageService } from './';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService{
  private socket: any;
  public data : any;
  public user : any;

  constructor() {}

  connect(){
    this.socket = io(environment.SERVER_URL);
    this.socket.on('message', (data : any) => {
      this.data = data;
      console.log(data);
    });
  }

  sendMessage(action : any = 'login'){
    this.user = JSON.parse(sessionStorage.getItem('curr-user') as any);
    this.socket.emit(action, this.user);
  }


}
