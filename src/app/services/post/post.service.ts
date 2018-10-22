import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService, IS_AUTH, IS_OAUTH } from '../auth/auth.service';
import { Config } from '../../app.config';

@Injectable()
export class PostService {

  config = new Config();
  url = this.config.API_URL_PROD + '/api/v1';

  constructor(private http: Http) { }

  getPostsByUserId(userId){
    return this.http.get(this.url + '/my-post/' + userId).map(response => response.json());
  }

  getPosts(){
    return this.http.get(this.url + '/post').map(response => response.json());
  }

  getPost(id: any){
    return this.http.get(this.url + '/post/' + id).map(response => response.json());
  }

  createPost(post){
    var headers = new Headers({'Content-Type':'application/json'});
    return this.http.post(this.url + '/post', JSON.stringify(post), { headers: headers }).map(response => response.json());
  }

  updatePost(post){
    var headers = new Headers({'Content-Type':'application/json'});
    return this.http.put(this.url + '/post/' + post.id, JSON.stringify(post), { headers: headers }).map(response => response.json());
  }

  updatePostLikes(post){
    var headers = new Headers({'Content-Type':'application/json'});
    return this.http.put(this.url + '/post/like/' + post._id, JSON.stringify(post), { headers: headers }).map(response => response.json());
  }

  deletePost(id: any){
    return this.http.delete(this.url + '/post/' + id).map(response => response.json());
  }

  postComment(comment: any, postId: any){
    var headers = new Headers({'Content-Type':'application/json'});
    return this.http.post(this.url + '/comment/' + postId, JSON.stringify(comment), { headers: headers }).map(response => response.json());
  }

  updateComment(comment: any, postId: any, commentId: any){
    var headers = new Headers({'Content-Type': 'application/json'});
    return this.http.put(this.url + '/comment/' + postId + "?commentId=" + commentId, JSON.stringify(comment), { headers: headers });
  }

  getComments(postId: any){
    return this.http.get(this.url + '/comment/' + postId).map(response => response.json());
  }

  deleteComment(postId: any, commentId: any){
    return this.http.delete(this.url + '/comment/' + postId + "?commentId=" + commentId).map(response => response.json());
  }

}
