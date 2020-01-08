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
  public questionNo: number;
  public questionState: string;
 
  constructor(private api: ApiService, private messenger: MessageService, private ws: WebSocketService) {}

  ngOnInit() {
    this.message = this.messenger.dequeue();
    
    this.getGameState();
    this.ctl = new ButtonControl();
  }

  open() {
    if (!this.ctl.canOpen) {
      return;
    }
    this.ctl.toggle('open');
    this.api.start().subscribe(
      resp => {
        this.message = resp["Success"];
        this.getGameState();
      },
      error => {
        console.log(error);
        this.ctl.toggle('open');
      }
    );
  }

  start(){
    if(!this.ctl.canStart){
      return;
    }
    this.ctl.toggle('start');
    this.api.start().subscribe(
      resp =>{
        this.message = resp["Success"];
        this.getGameState();
      },
      error => {
        console.log(error);
        this.ctl.toggle('start');
      }
    );
  }

  next(){
    if(!this.ctl.canNext){
      return;
    }
    this.api.next().subscribe(
      resp => {
        this.message = resp["Success"];
        this.getGameState();
      },
      error => {
        console.log(error);
      }
    );
  }

  end(){
    if(!this.ctl.canEnd){
      return;
    }
    if(confirm("Are you sure you want to END the game?")){
      this.api.end().subscribe(
        resp => {
          this.message = resp["Success"];
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  reset(){
    if(!this.ctl.canReset){
      return;
    }

    if (confirm("Are you sure you want to RESET the game?")) {
      this.api.reset().subscribe(
        resp => {
          this.message = resp["Success"];
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  unlock(){
  }

  getGameState(){
    this.api.getGameState().subscribe(
      resp =>{
        console.log(resp);
        this.questionNo = resp["questionNo"];
        this.questionState = resp["questionState"];
        if (resp["questionState"] != "END"){
          this.ctl.set('next', false);
        }else{
          this.ctl.set('next', true);
        }
      }
    );

  }

}
