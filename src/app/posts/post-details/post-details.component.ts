import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { AuthService, IS_AUTH, IS_OAUTH } from '../../services';
import { PostService } from '../../services';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  @ViewChild('likeIcon') likeIcon: ElementRef;
  @ViewChild('likeCount') likeCount: ElementRef;
  post: any;
  commentBody: string = '';

  userDetails: any = {};

  constructor(private authService: AuthService, private route: ActivatedRoute, private postService: PostService, private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) =>
      this.postService.getPost(params.get('id')))
      .subscribe((response) => {
        if(response.success) {
          this.post = response.data;
          if(this.authService.getAuthType() == IS_AUTH) this.getAuthUser(this.post);
          if(this.authService.getAuthType() == IS_OAUTH) this.getOAuthUser(this.post);
        }
        else this.post = {};
    });
  }

  getAuthUser(post){
    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.getUserDetails()
      .subscribe((response) => {
        this.userDetails = response.user;
        this.checkUserLike(post);
        if(!response.user.profileImage) this.userDetails.profileImage = "./assets/images/user-default.png";
      });
    }
  }

  getOAuthUser(post){
    if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        if(response){
          this.userDetails = response;
          this.checkUserLike(post);
        }
      })
      .catch();
    }
  }

  checkUserLike(post){
    if(post){
      let likes: any[] = post.likes;
      for(let index = 0; index < likes.length; index++){
        if(likes[index].userId == this.userDetails._id){
          this.likeIcon.nativeElement.className += " icon-blue";
          this.likeCount.nativeElement.className = "blue-text";
        }
      }
    }
  }

  likeUnlikePost(){
    let likeIconClass: string = this.likeIcon.nativeElement.className;
    let likeCountClass: string = this.likeCount.nativeElement.className;
    let likes: any[] = this.post.likes;
    let backupLikes = likes;
    for(let index = 0; index < likes.length; index++){
      if(likes[index].userId == this.userDetails._id){
        likes.splice(index, 1);
        this.post.likes = likes;
        this.likeIcon.nativeElement.className = "material-icons";
        this.likeCount.nativeElement.className = "";
        this.postService.updatePostLikes(this.post).subscribe(response => { 
          if(response){
            if(!response.success) {
              this.post.likes = backupLikes;
              this.likeIcon.nativeElement.className += " icon-blue";
              this.likeCount.nativeElement.className = "blue-text";
            }
          }
          else {
            this.post.likes = backupLikes;
            this.likeIcon.nativeElement.className += " icon-blue";
            this.likeCount.nativeElement.className = "blue-text";
          }
        });
        return;
      }
    }
    likes.push({ userId: this.userDetails._id });
    this.post.likes = likes;
    this.likeIcon.nativeElement.className += " icon-blue";
    this.likeCount.nativeElement.className = "blue-text";
    this.postService.updatePostLikes(this.post).subscribe(response => { 
      if(response){
        if(!response.success){
          this.post.likes = backupLikes;
          this.likeIcon.nativeElement.className = "material-icons";
          this.likeCount.nativeElement.className = "";
        }
      }
      else{
          this.post.likes = backupLikes;
          this.likeIcon.nativeElement.className = "material-icons";
          this.likeCount.nativeElement.className = "";
      }
    });
  }

  postComment(){
    let author: string;
    let profileImage: string;

    if(this.userDetails.facebook){
      author = this.userDetails.facebook.name;
      profileImage = this.userDetails.facebook.profileImage;
    }
    else if(this.userDetails.google){
      author = this.userDetails.google.name;
      profileImage = this.userDetails.google.profileImage;
    }
    else{
      author = this.userDetails.name;
      profileImage = this.userDetails.profileImage;
    }

    let comment = {
      userId: this.userDetails._id,
      author: author, 
      body: this.commentBody, 
      date: Date.now().toString(), 
      profileImage: profileImage
    };
    this.postService.postComment(comment, this.post._id).subscribe(() => {
      this.postService.getComments(this.post._id).subscribe((response) => {
        this.commentBody = '';
        if(response && response.success) this.post.comments = response.data;
        else this.post.comments = [];
      });
    });
  }

  updateComment(comment){
    comment.editMode = false;
    let updatedComment = {
      body: comment.body
    }
    this.postService.updateComment(updatedComment, this.post._id, comment._id).subscribe(() => {
      this.postService.getComments(this.post._id).subscribe((response) => {
        if(response && response.success) this.post.comments = response.data;
        else this.post.comments = [];
      });
    });
  }

  deleteComment(commentId: any){
    this.postService.deleteComment(this.post._id, commentId).subscribe(() => {
      this.postService.getComments(this.post._id).subscribe((response) => {
        if(response && response.success) this.post.comments = response.data;
        else this.post.comments = [];
      });
    });
  }

}
