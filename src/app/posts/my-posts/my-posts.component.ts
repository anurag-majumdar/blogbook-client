import { Component, OnInit } from '@angular/core';
import { PostService, PaginationService, AuthService, IS_AUTH, IS_OAUTH } from '../../services';

@Component({
  selector: 'my-post',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  noPosts: boolean = false;
  posts: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  userDetails: any;

  constructor(private authService: AuthService, private postService: PostService, private pagerService: PaginationService) { }

  ngOnInit() {
    if(this.authService.getAuthType() == IS_AUTH){
      this.authService.getUserDetails().subscribe((response) => {
        this.userDetails = response.user;
        this.fetchUserPosts(this.userDetails);
      });
    }
    else if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        this.userDetails = response;
        this.fetchUserPosts(this.userDetails);
      })
      .catch();
    }
  }

  fetchUserPosts(userDetails){
    this.postService.getPostsByUserId(userDetails._id).subscribe((response) => {
      if(response) {
        if(response.success){
          this.posts = response.data;
          if(this.posts.length == 0) this.noPosts = true;
        }
        else{
          this.posts = [];
          this.noPosts = true;
        }
      }
      this.setPage(1);
    });
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      // get pager object from service
      this.pager = this.pagerService.getPager(this.posts.length, page);
    
      // get current page of items
      this.pagedItems = this.posts.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  deletePost(id){
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts().subscribe((response) => {
        if(response){
          if(response.success){
            this.posts = response.data;
            if(this.posts.length > (this.pager.currentPage - 1) * 10) this.setPage(this.pager.currentPage);
            else if(this.posts.length > 0) this.setPage(this.pager.currentPage - 1);
            else{
              this.noPosts = true;
              this.setPage(this.pager.currentPage);
            }
          }
          else{
            this.posts = [];
            this.noPosts = true;
          }
        }
      });
    });
  }

}
