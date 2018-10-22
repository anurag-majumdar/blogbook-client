import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IS_AUTH, IS_OAUTH } from '../services/auth/auth.service';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userDetails: any = new Object();
  userId: any;
  
  constructor(private authService: AuthService, private toastService: MzToastService, private router: Router) { }

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails(){
    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.getUserDetails().subscribe((response) => {
        this.userDetails = response.user;
        if(!this.userDetails.profileImage) this.userDetails.profileImage = "./assets/images/user-default.png";
      });
    }

    else if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        if(response){
          this.userId = response._id;
          if(response.facebook) {
            this.userDetails = response.facebook;
            this.userDetails.facebook = true;
          }
          else if(response.google) {
            this.userDetails = response.google;
            this.userDetails.google = true;
          }
        }
      })
      .catch();
    }
  }

  saveUser(){
    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.updateUserDetails(this.userDetails).subscribe((response) => {
        if(response){
          if(response.success){
            this.toastService.show('Successfully Updated User Details!', 2000,'green rounded');
            this.router.navigate(['/dashboard']);
            this.fetchUserDetails();
          }
          else this.toastService.show('Could Not Update, Please Try Again.', 2000,'red rounded');
        }
        else this.toastService.show('Internal Server Error Occurred!', 2000,'red rounded');
      });
    }
    else if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.updateOAuthUserDetails(this.userId, this.userDetails).subscribe((response) => {
        if(response){
          if(response.success){
            this.toastService.show('Successfully Updated User Details!', 2000,'green rounded');
            this.router.navigate(['/dashboard']);
            this.fetchUserDetails();
          }
          else this.toastService.show('Could Not Update, Please Try Again.', 2000,'red rounded');
        }
        else this.toastService.show('Internal Server Error Occurred!', 2000,'red rounded');
      });
    }
  }

}
