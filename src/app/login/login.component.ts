import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../services/message.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public message: string;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private messenger: MessageService) { }

  ngOnInit() {
    this.createLoginForm();
    this.message = this.messenger.dequeue();
  }

  createLoginForm(){
    this.loginForm = this.fb.group(
      {
        username: [null, [Validators.required, Validators.minLength(2)]],
        password: [null, [Validators.required, Validators.minLength(2)]]
      }
    );
  }

  login(){
    if(this.authService.login(this.loginForm.get("username").value, this.loginForm.get("password").value)){
      this.router.navigate(['/admin'])
    }else{

    }
  }

}
