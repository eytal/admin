import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";

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
  }

}
