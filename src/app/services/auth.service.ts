import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService } from '../api/api.service';
import { MessageService } from './message.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_ENDPOINT: string = environment.api_endpoint;
  constructor(private api: ApiService, private messenger: MessageService) { }

  login(username: string, password: string): Observable<any>{
    return this.api.login(username, password);
  }

  // Verify JWT
  isLoggedIn(): boolean{
    if(localStorage.getItem('token')){
      return true;
    }else{
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

}
