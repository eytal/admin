import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: WebSocket;
  stompClient: any;

  WSOCK_API:string = environment.api_endpoint +"/game";

  constructor() {}

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.WSOCK_API);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    this.stompClient.connect({}, function (frame:any) {
      this.stompClient.subscribe('/topic/game', function(sdkEvent: any) {
        this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  onMessageReceived(message) {
    console.log("Message Recieved from Server :: " + message);
  }

}
