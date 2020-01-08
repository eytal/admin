import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { WebSocketService } from '../services/web-socket.service';
import { ButtonControl } from './button-control'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public message:string;
  public ctl: ButtonControl;
 
  constructor(private api: ApiService, private messenger: MessageService, private ws: WebSocketService) {}

  ngOnInit() {
    this.message = this.messenger.dequeue();
    //this.message = "test message dasdasdsa asdasd asdsa d sa asd asdasadasdasd sdadas ";
    this.getGameState();
    this.ctl = new ButtonControl();
  }

  start(){
    this.api.start().subscribe(
      resp =>{

      },
      error => {

      }
    );
  }

  next(){
    this.api.next().subscribe(
      resp => {

      },
      error => {

      }
    );
  }

  end(){
    if(confirm("Are you sure you want to END the game?")){
      this.api.end().subscribe(
        resp => {

        },
        error => {

        }
      );
    }
  }

  reset(){
    if (confirm("Are you sure you want to RESET the game?")) {
      this.api.reset().subscribe(
        resp => {

        },
        error => {

        }
      );
    }
  }

  unlock(){
  }

  getGameState(){

  }

}
