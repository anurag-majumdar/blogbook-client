import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { Router } from '@angular/router';

import { MzToastService } from 'ng2-materialize';

import { PostService, AuthService, IS_AUTH, IS_OAUTH } from '../../services';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  post: any = {
    title: '',
    tags: [],
    bodyDescription: ''
  };

  constructor(private authService: AuthService, private postService: PostService, private router: Router, private toastService: MzToastService) { }

  ngOnInit() {
    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.getUserDetails().subscribe((response) => {
        this.post.userId = response.user._id;
        this.post.author = response.user.name;
        this.post.profileImage = response.user.profileImage;
      });
    }
    else if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        this.post.userId = response._id;
        if(response.facebook) {
          this.post.author = response.facebook.name;
          this.post.profileImage = response.facebook.profileImage;
        }
        else if(response.google) {
          this.post.author = response.google.name;
          this.post.profileImage = response.google.profileImage;
        }
      })
      .catch();
    }
  }

  createPost(){
    if(this.post.title != '' && this.post.bodyDescription != ''){
      this.post.date = Date.now().toString();
      this.postService.createPost(this.post).subscribe((response) => {
        if(response){
          if(response.success){
            this.toastService.show('Post Created successfully!', 2000,'green rounded');
            this.router.navigate(['/posts']);
          }
          else{
            this.toastService.show('Some error occurred!', 2000, 'red rounded');
          }
        }
        else{
          this.toastService.show('Some error occurred!', 2000, 'red rounded');
        }
      }); 
    }
    else{
      this.toastService.show('Please include Title and Description!', 2000, 'orange rounded');
    }
  }

}
