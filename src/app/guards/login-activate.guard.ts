import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActivateGuard implements CanActivate  {

  constructor(private auth: AuthService, private router: Router, private messager: MessageService){}
  
  canActivate(): boolean{
    if(this.auth.isLoggedIn()){
        return true;
    }
    console.log('LoginActivateGuard# Not logged in');
    this.messager.queue("Not authorized to access, please login");
    this.router.navigate(['login']);
    return false;
  }
}
