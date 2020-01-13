import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api/api.service';
import { MessageService } from '../services/message.service';
import { WebSocketService } from '../websocket/web-socket.service';
import { ButtonControl } from './button-control';
import { ApiResponse } from '.././api/api-response';
import { GameState } from './game-state';
import { Observable } from 'rxjs';
import { UserRank } from './user-rank';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public message: string;
  public ctl: ButtonControl;
  public gameState: GameState;
  public questionNo: number;
  public questionState: string;
  public questionStatus: string;
  public userRanking: UserRank[];
  public waitingUsers: string[];

  constructor(private api: ApiService, private messenger: MessageService, private ws: WebSocketService) {
    this.questionNo = 0;
    this.message = '';
    this.ctl = new ButtonControl();
    this.ws.componentHandler(this.handleWSMessages.bind(this), this.restoreGameState.bind(this));
  }

  ngOnInit() {
    this.message = this.messenger.dequeue();
    this.userRanking = null;
    this.waitingUsers = null;
    this.api.restoreSession();
    this.restoreGameState({});
    this.ws.disconnectFlag = false;
    this.ws.connect();
  }

  open() {
    if (!this.ctl.canOpen) {
      return;
    }
    this.ctl.canOpen = false;
    this.api.get('open').subscribe(
      resp => {
        this.message = resp.Success;
      },
      error => {
        console.log(error);
        this.ctl.canOpen = true;
      }
    );
  }

  start() {
    if (!this.ctl.canStart) {
      return;
    }
    this.ctl.canStart = false;
    this.api.get('start').subscribe(
      resp => {
        this.message = resp.Success;
      },
      error => {
        console.log(error);
        this.ctl.canStart = true;
      }
    );
  }

  next() {
    if (!this.ctl.canNext) {
      return;
    }
    this.ctl.canNext = false;
    this.api.get('next').subscribe(
      resp => {
        this.message = '';
        this.userRanking = null;
        this.waitingUsers = null;
      },
      error => {
        console.log(error);
        this.ctl.canNext = true;
      }
    );
  }
  ranking() {
    // if (!this.ctl.canNext) {
    //   return;
    // }
    // this.ctl.canNext = false;
    this.api.getRanking().subscribe(
      resp => {
        this.userRanking = resp;
      },
      error => {
        console.log(error);
      }
    );
  }

  waiting() {
    // if (!this.ctl.canNext) {
    //   return;
    // }
    // this.ctl.canNext = false;
    this.api.getWaiting().subscribe(
      resp => {
        this.waitingUsers = resp;
        console.log(resp);
      },
      error => {
        console.log(error);
      }
    );
  }


  end() {
    if (!this.ctl.canEnd) {
      return;
    }
    if (confirm('Are you sure you want to END the game?')) {
      this.api.get('end').subscribe(
        resp => {
          this.message = resp.Success;
          this.waitingUsers = [];
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  reset() {
    if (!this.ctl.canReset) {
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


  restoreGameState(evt: any) {
    this.api.getGameState().subscribe(
      resp => {
        console.log('Restore game state', resp);
        this.handleWSMessages(resp);
      },
      error => {
        console.log('Restore error', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  handleWSMessages(gs: GameState) {
    this.gameState = gs;
    this.questionState = gs.questionState;
    this.questionNo = gs.question;
    if (gs.progress == 'EMPTY') {
      this.questionStatus = 'Game room is not open';
      this.ctl.canOpen = true;
      this.userRanking = [];
      this.waitingUsers = [];
      this.ctl.reset();

    } else if (gs.progress == 'WAITING') {
      this.ctl.canOpen = false;
      this.ctl.canStart = true;
      this.ctl.canShowNext = false;
      this.ctl.canShowEnd = false;
      this.ctl.canEnd = false;
      this.questionStatus = 'Waiting to start';
      this.ctl.canShowWaiting = false;
      this.ctl.canShowRanking = false;

    } else if (gs.progress == 'PLAYING') {
      this.ctl.canStart = false;
      this.ctl.canOpen = false;
      this.ctl.canShowNext = true;
      this.ctl.canEnd = true;
      this.ctl.canShowEnd = true;
      this.ctl.canShowWaiting = true;
      this.ctl.canShowRanking = true;

      if (gs.questionState == 'END') {
        this.questionStatus = 'Question has ended';
        this.ctl.canNext = true;
      } else if (gs.questionState == 'START') {
        this.questionStatus = 'Question has started';
        this.ctl.canNext = true;
      }
    } else if (gs.progress == 'END') {
      this.questionStatus = 'You have ended the game';
      this.ctl.canShowNext = false;
      this.ctl.canOpen = false;
      this.ctl.canReset = true;
      this.ctl.canEnd = false;
      this.ctl.canShowEnd = false;
      this.ctl.canShowWaiting = false;
      this.ctl.canShowRanking = true;
    }
    
  }

}
