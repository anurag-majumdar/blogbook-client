import { Component, OnInit } from '@angular/core';
import { AuthService, IS_AUTH, IS_OAUTH } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser: any = new Object();

  constructor(private authService: AuthService, private router: Router, private toastService: MzToastService) { }

  ngOnInit() {
  }

  login(){
    this.authService.loginUser(this.loginUser)
    .subscribe((response) => {
      if(response && response.success == true){
        this.toastService.show('Logged in successfully!', 2000, 'green rounded');
        this.authService.setToken(response.token);
        this.authService.setAuthType(IS_AUTH);
        this.router.navigate(['/dashboard']);
      }
      else{
        this.toastService.show('Incorrect username or password!', 2000, 'red rounded');
        this.router.navigate(['/login']);
      }
    });
  }

  facebookLogIn(){
    this.authService.facebookLogIn().then(() => {
      this.toastService.show('Logged in successfully!', 2000, 'green rounded');
      this.authService.setAuthType(IS_OAUTH);
      this.router.navigate(['/dashboard']);
    });
  }

  googleLogIn(){
    this.authService.googleLogIn().then(() => {
      this.toastService.show('Logged in successfully!', 2000, 'green rounded');
      this.authService.setAuthType(IS_OAUTH);
      this.router.navigate(['/dashboard']);
    });
  }

}
