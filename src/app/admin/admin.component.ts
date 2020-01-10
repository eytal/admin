import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api/api.service';
import { MessageService } from '../services/message.service';
import { WebSocketService } from '../websocket/web-socket.service';
import { ButtonControl } from './button-control';
import { ApiResponse } from '.././api/api-response';
import { GameState } from './game-state';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public message: string;
  public ctl: ButtonControl;
  public questionNo: number;
  public questionState: string;
  public questionStatus: string;
  public gameEnd = false;
 
  constructor(private api: ApiService, private messenger: MessageService, private ws: WebSocketService) {
    this.api.restoreSession();
    this.questionStatus = 'Game room is not open';
    this.restoreGameState();
    this.gameEnd = false;
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
        this.message = resp.Success;
        this.ctl.canStart = true;
        this.ctl.canOpen = false;
      },
      error => {
        console.log(error);
        this.ctl.toggle('open');
      }
    );
  }

  start(){
    if (!this.ctl.canStart) {
      return;
    }
    this.ctl.toggle('start');
    this.api.get('start').subscribe(
      resp =>{
        this.message = resp.Success;
        this.ctl.canOpen = false;
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
    if (confirm('Are you sure you want to END the game?')) {
      this.api.get('end').subscribe(
        resp => {
          this.message = resp.Success;
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

    if (confirm('Are you sure you want to RESET the game?')) {
      this.api.get('reset').subscribe(
        resp => {
          this.message = resp.Success;
          this.questionStatus = 'Game has resetted';
        },
        error => {
          console.log(error);
        }
      );
    }
  }


  restoreGameState(): void {
    this.api.getGameState().subscribe(
      resp =>{
        console.log('Restore game state', resp);
        this.handleWSMessages(resp);
      }
    );
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  handleWSMessages(gs: GameState) {
    this.questionState = gs.questionState;
    this.questionNo = gs.question;
    if (gs.progress == 'EMPTY') {
      this.questionStatus = 'Game room is not open';
      this.ctl.reset();

    }else if(gs.progress == 'WAITING') {
      this.ctl.canOpen = false;
      this.ctl.canStart = true;
      this.questionStatus = 'Waiting to start';

    }else if(gs.progress == 'PLAYING') {
      this.ctl.canStart = false;
      this.ctl.canOpen = false;
      this.ctl.canShowNext = true;
      this.ctl.canEnd = true;
      this.ctl.canShowEnd = true;

      if(gs.questionState == 'END') {
        this.questionStatus = 'Question has ended';
        this.ctl.canNext = true;
      }else if(gs.questionState == 'START') {
        this.questionStatus = 'Question has started';
        this.ctl.canNext = false;
      }
    }else if(gs.progress == 'END') {
      this.questionStatus = 'You have ended the game';
      this.ctl.canShowNext = false;
      this.ctl.canOpen = false;
      this.ctl.canReset = true;
      this.ctl.canEnd = false;
      this.ctl.canShowEnd = false;
    }
    
  }

}
