import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import { AdminComponent } from '../admin/admin.component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: WebSocket;
  stompClient: any;
  private adminFn: (msg: any) => void;

  WSOCK_API:string = environment.api_endpoint +"/game";
  //WSOCK_API: string = 'http://cnybackend.southeastasia.cloudapp.azure.com:8080' +"/game";


  constructor() {}

  //Function from Admin Component to handle websocket messages
  componentHandler(fn: (msg: any) => void) {
    this.adminFn = fn;
  }

  connect() {
    console.log("Initialize WebSocket Connection");
    //let ws = new SockJS(this.WSOCK_API);
    this.stompClient = new Stomp.Client({});
    this.stompClient.webSocketFactory = () => new SockJS(this.WSOCK_API);
    const _this = this;

    this.stompClient.onConnect = (frame:any) => {
      var subscription = this.stompClient.subscribe('/topic/game', (sdkEvent: any) => {
        this.onMessageReceived(sdkEvent.body);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }
    this.stompClient.onStompError = this.errorCallBack;
    this.stompClient.activate();
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    this.stompClient.deactivate();
    console.log("Disconnected");
    this.stompClient.deactivate();
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }
  
  onMessageReceived(message: any) {
    console.log("WS:",JSON.parse(message));
    this.adminFn(JSON.parse(message));
  }

}
