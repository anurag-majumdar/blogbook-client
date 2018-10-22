import { Component, OnInit } from '@angular/core';
import { Config } from '../app.config';
import { SearchService, AuthService, IS_AUTH, IS_OAUTH } from '../services';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  posts: any = [];
  userDetails: any;
  config = new Config();

  constructor(private searchService: SearchService, private authService: AuthService) { }

  ngOnInit() {

    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.getUserDetails().subscribe((response) => {
        this.userDetails = response.user;
        if(!this.userDetails.profileImage) this.userDetails.profileImage = this.config.defaultProfileImage;
        this.getUserPosts(response.user._id);
      });
    }

    if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        if(response){
          if(response.facebook) {
            this.userDetails = response.facebook;
            this.getUserPosts(response._id);
          }
          else if(response.google) {
            this.userDetails = response.google;
            this.getUserPosts(response._id);
          }
        }
      })
      .catch(() => {
        this.userDetails.profileImage = this.config.defaultProfileImage
      });
    }

  }

  getUserPosts(id){
    this.searchService.getPostsByUserId(id)
    .subscribe((response) => {
      if(response){
        if(response.success){
          this.posts = response.data;
        }
      }
    });
  }

}
