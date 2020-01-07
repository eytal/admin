import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_ENDPOINT: string = environment.api_endpoint;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    })
  }

  constructor(private http: HttpClient) {}

  login(username: string, password: string){
    var result =  this.http.post(this.API_ENDPOINT + '/authenticate', {username: username, password: password}, this.httpOptions);
    console.log(result);
    //resolve result from page
    return true;
  }

}
