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
    this.questionStatus = "Game room is not open";
    this.restoreGameState();
  }

  ngOnInit() {
    this.message = this.messenger.dequeue();
    this.questionNo = 0;
    this.ctl = new ButtonControl();
    this.ws.componentHandler(this.handleWSMessages.bind(this));
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
        this.ctl.set('start', true);
        this.ctl.set('open', false);
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
        this.ctl.set('open', false);
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
        this.message = '';
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
          this.ctl.set('reset', true);
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
          this.questionStatus = 'Game has resetted';
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  unlock(){
  }

  restoreGameState(){
    this.api.getGameState().subscribe(
      resp =>{
        console.log(resp);
        this.questionNo = resp["question"];
        this.questionState = resp["questionState"];
        this.handleWSMessages(resp);
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

  handleWSMessages(msg: any){
    //console.log("admin",msg);
    this.questionState = msg['questionState'];
    this.setQuestionStatus(this.questionState);
    this.questionNo = msg['question'];

    if(msg["question"] == 0){
      this.ctl.reset();
      this.questionStatus = "Game room is not open";
      this.ctl.set('end', false);
    }else if(msg["questionState"]=="END"){
      this.ctl.set('next', true);
    } else if (msg["questionState"] == "START"){
      this.ctl.set('next', false);
    }

    if(msg["question"] > 0){
      if (!this.ctl.canEnd) {
        this.ctl.toggle('end');
      }
      if(this.ctl.canStart){
        this.ctl.toggle('start');
      }
      if(this.ctl.canOpen){
        this.ctl.toggle('open');
      }
    }
  }

}
