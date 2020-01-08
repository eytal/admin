import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  mergeMap, switchMap, retry,
  map, catchError, filter, scan
} from 'rxjs/operators';

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
      'Authorization': "Bearer <insert_jwt_token>"
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
          console.log('resp', resp);
          return resp;
        }
        ),
    );
  }

  // Game API
  open() {
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/open', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );

  }

  start(){
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/start', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
    
  }

  next() {
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/next', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
  }

  end() {
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/end', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
    
  }

  reset() {
    return this.http.get<Observable<HttpResponse<any>>>(this.GAME_API_URL + '/reset', this.httpOptions).pipe(
      map(
        resp => {
          //localStorage.setItem('currentUser', username);
          console.log('resp', resp);
          return resp;
        }
      ),
    );
  }

  getGameState(){
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

}
