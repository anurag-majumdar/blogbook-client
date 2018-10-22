import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../../app.config';

@Injectable()
export class SearchService {

  config = new Config();
  url = this.config.API_URL_PROD + '/search';

  constructor(private http: Http) { }

  searchPosts(query){
    let headers = new Headers({'Content-Type':'application/json'});
    return this.http.post(this.url + "/posts" + "?query=" + query, {}, { headers: headers }).map(response => response.json());
  }

  searchUsers(query){
    let headers = new Headers({'Content-Type':'application/json'});
    return this.http.post(this.url + "/users" + "?query=" + query, {}, { headers: headers }).map(response => response.json());
  }

  getUserDetails(id){
    return this.http.get(this.url + "/user/" + id).map(response => response.json());
  }

  getPostsByUserId(id){
    return this.http.get(this.url + "/posts/user/" + id).map(response => response.json());
  }

}
