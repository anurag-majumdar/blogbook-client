import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { ActivatedRoute, Router } from '@angular/router';

import { MzToastService } from 'ng2-materialize';
import { PostService } from '../../services';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  post: Post = {
    title: '',
    tags: [],
    bodyDescription: ''
  };

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router, private toastService: MzToastService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.postService.getPost(params['id']).subscribe((response) => {
        this.post.id = params['id'];
        this.post.title = response.data.title;
        this.post.tags = response.data.tags;
        this.post.bodyDescription = response.data.bodyDescription;
      });
    });
  }
  
  updatePost(){
    if(this.post.title != '' && this.post.bodyDescription != ''){
      this.postService.updatePost(this.post).subscribe((response) => {
        if(response && response.success){
          this.toastService.show('Post Updated successfully!', 2000,'green rounded');
          this.router.navigate(['/posts']);
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
