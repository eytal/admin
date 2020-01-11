import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { AdminComponent } from '../admin/admin.component';
import { window } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  stompClient: any;
  private adminFn: (msg: any) => void;
  private restoreFn: (evt: any ) => void;
  public disconnectFlag: boolean;

  WSOCK_API: string = environment.api_endpoint + '/game';
  // WSOCK_API: string = 'http://cnybackend.southeastasia.cloudapp.azure.com:8080' +"/game";

  constructor() {
    this.disconnectFlag = false;
  }

  // Function from Admin Component to handle websocket messages
  componentHandler(fn: (msg: any) => void, fn2: () => void) {
    this.adminFn = fn;
    this.restoreFn = fn2;
  }

  connect() {
    console.log('Initialize WebSocket Connection');
    // let ws = new SockJS(this.WSOCK_API);
    // console.log(this.restoreFn);
    this.stompClient = new Stomp.Client({});

    this.stompClient.webSocketFactory = () => {
      const socket: WebSocket = new SockJS(this.WSOCK_API);
      socket.onerror = this.onError.bind(this);
      return socket;
    };

    // COnfiguration
    this.stompClient.reconnectDelay = 2000;
    this.stompClient.onStompError = this.onError.bind(this);
    this.stompClient.onWebSocketClose = this.onError.bind(this);
    this.stompClient.onWebSocketError = this.onError.bind(this);

    this.stompClient.onConnect = (frame: any) => {
      // Restore game state if there was a disconnection from the websocket
      if (this.disconnectFlag) {
        console.log('WS reconnected');
        this.restoreFn({});
        this.disconnectFlag = false;
      }
      const subscription = this.stompClient.subscribe('/topic/game', (sdkEvent: any) => {
        this.onMessageReceived(sdkEvent.body);
      });
    };
    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    this.stompClient.deactivate();
    console.log('Disconnected');
  }

  onError(evt: any) {
    this.disconnectFlag = true;
    console.log('Stomp error, or websocket connection error');
    console.log(evt);
    // If websocket persistent failure, obtaining game state will transition to polling with http get
    this.restoreFn(evt);
  }

  onMessageReceived(message: any) {
    console.log('WS:', JSON.parse(message));

    this.adminFn(JSON.parse(message));
  }

}
