import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public messages: string[] = [];
  constructor() { }

  queue(msg){
    this.messages.push(msg);
  }

  dequeue(): string{
    if(this.messages.length > 0){
      return this.messages.shift();
    }
      return ''; 
  }
}
