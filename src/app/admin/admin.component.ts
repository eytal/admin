import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public message:string;

  constructor(private api: ApiService, private auth: AuthService, private messenger: MessageService) {}

  ngOnInit() {
    this.message = this.messenger.dequeue();
    //this.message = "test message dasdasdsa asdasd asdsa d sa asd asdasadasdasd sdadas ";
    this.getGameState();
  }

  start(){
  }

  next(){
  }

  end(){
    if(confirm("Are you sure you want to END the game?")){

    }
  }

  reset(){
    if (confirm("Are you sure you want to RESET the game?")) {

    }
  }

  unlock(){
  }

  getGameState(){

  }

}
