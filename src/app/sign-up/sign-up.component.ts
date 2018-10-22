import { Component, OnInit } from '@angular/core';
import { AuthService, IS_AUTH, IS_OAUTH } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Config } from '../app.config';
import { MzToastService } from 'ng2-materialize';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  newUser: any = new Object();
  config = new Config();

  constructor(private authService: AuthService, private router: Router, private toastService: MzToastService) { }

  ngOnInit() {
  }

  register(){
    this.newUser.username = this.newUser.email;
    this.newUser.profileImage = this.config.defaultProfileImage;
    this.authService.registerUser(this.newUser)
    .subscribe((response) => {
      if(response && response.success == true){
        this.toastService.show('You have registered successfully! Please Log In', 2000,'green rounded');
        this.router.navigate(['/login']);
      }
      else{
        this.toastService.show('Some error occurred. Please try again!', 2000,'red rounded');
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
