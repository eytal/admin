import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_ENDPOINT: string = environment.api_endpoint;
  constructor(private api: ApiService, private messenger: MessageService) { }

  login(username: string, password: string): boolean{
    if(this.api.login(username, password)){
      return true
    }else{
      this.messenger.queue("Incorrect UsernamePassword");
      return false;
    }
  }

  // Verify JWT
  isLoggedIn(): boolean{
    return true;
  }

  test() {
    
  }

}
