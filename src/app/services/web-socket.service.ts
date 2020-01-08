import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {SockJS} from "sockjs-client";
import {Client} from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: WebSocket;
  stompClient: any;

  WSOCK_API:string = environment.api_endpoint +"/game";

  constructor() { 
    const stompConfig = {
      // Typically login, passcode and vhost
      // Adjust these for your broker
      connectHeaders: {},

      // Broker URL, should start with ws:// or wss:// - adjust for your broker setup
      // brokerURL: "ws://cny-game.herokuapp.com/game",
      // Keep it off for production, it can be quite verbose
      // Skip this key to disable
      debug: function (str: string) {
        console.log('STOMP: ' + str);
      },
      // If disconnected, it will retry after 1s
      reconnectDelay: 5000,
    };

    this.stompClient = new Client(stompConfig);
    this.stompClient.webSocketFactory = () => new SockJS(this.WSOCK_API);
    this.stompClient.onConnect = (frame: any) => {
      // The return object has a method called `unsubscribe`
      let subscription = this.stompClient.subscribe('/topic/game', function (message: any) {
        let payload = JSON.parse(message.body);
        console.log(payload);
      });
    }

    this.stompClient.activate();

  }

}
