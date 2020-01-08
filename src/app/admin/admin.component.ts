import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
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
  public questionStatus: string;
 
  constructor(private api: ApiService, private messenger: MessageService, private ws: WebSocketService) {
    this.api.restoreSession();
  }

  ngOnInit() {
    this.message = this.messenger.dequeue();
    this.questionNo = 0;
    this.questionStatus = "Game room is not open";
    this.ctl = new ButtonControl();
    this.ws.connect();
  }

  open() {
    if (!this.ctl.canOpen) {
      return;
    }
    this.ctl.toggle('open');
    this.api.get('open').subscribe(
      resp => {
        this.message = resp["Success"];
        this.questionStatus = "Game has not started";
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
    this.api.get('start').subscribe(
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
    this.api.get('next').subscribe(
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
      this.api.get('end').subscribe(
        resp => {
          this.message = resp["Success"];
          this.questionStatus = "The game has ended";
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
      this.api.get('reset').subscribe(
        resp => {
          this.message = resp["Success"];
          //window.location.reload();
        },
        error => {
          console.log(error);
          window.location.reload();
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
        this.questionNo = resp["question"];
        this.questionState = resp["questionState"];
        this.setQuestionStatus(this.questionState);
        if (resp["questionState"] != "END"){
          this.ctl.set('next', false);
        }else{
          this.ctl.set('next', true);
        }
      }
    );

  }

  setQuestionStatus(qnstate:string){
    if(qnstate == "START"){
      this.questionStatus = "Question has started";
    }else if(qnstate == "END"){
      this.questionStatus = "Question has ended";
    }
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

}
