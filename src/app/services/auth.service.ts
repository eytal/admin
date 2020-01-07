import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_ENDPOINT: string = environment.api_endpoint;
  constructor() { }

  login(username: string, password: string): boolean{
    return true
  }

  // Verify JWT
  isLoggedIn(): boolean{
    return true;
  }

  test() {
    
  }

}
