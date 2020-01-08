import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_ENDPOINT: string = environment.api_endpoint;
  GAME_API_URL: string = this.API_ENDPOINT + "/api/game";
  authHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer <insert jwt token>"
    }),
  }

  constructor(private http: HttpClient) {}
  // Authentication
  login(username: string, password: string): Observable<any>{
    return this.http.post<Observable<HttpResponse<any>>>(this.API_ENDPOINT + '/authenticate', {username, password}, this.authHttpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          localStorage.setItem('token', resp['token']);
          this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': "Bearer " + resp['token']
            })
          };

         // console.log('changed authorization headers', resp);
          //console.log(this.httpOptions);
          return resp;
        }
        ),
    );
  }

  // Game API
  get(path: string){
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/'+path, this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
  }
  
  restoreSession(){
    if(localStorage.getItem('token')){
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem('token')
        })
      };
    }
  }


  getGameState(){
    //this.debug();

    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/state', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
  }

  unlock() {
  }
  debug(){
    console.log(localStorage.getItem('token'));
    console.log(this.httpOptions.headers)
  }

}
