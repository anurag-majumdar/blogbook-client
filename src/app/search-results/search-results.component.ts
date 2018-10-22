import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService, AuthService, IS_AUTH, IS_OAUTH } from '../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  searchType: string = "posts";
  searchResults: any[];
  query: any;

  constructor(private authService: AuthService, private searchService: SearchService, private route: ActivatedRoute, private detect: ChangeDetectorRef) { }

  ngOnInit() {
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });

    this.route.paramMap.switchMap((params: ParamMap) => this.query = params.get('query'))
    .toPromise().then();

    this.search();
    
  }

  search(){
    if(this.searchType == "posts") this.searchPosts();
    else if(this.searchType == "users") this.searchUsers();
  }

  searchPosts(){
    this.searchService.searchPosts(this.query)
    .subscribe((response) => {
      if(response){
        if(response.success){
          this.searchResults = response.result;
        }
      }
    });
  }

  searchUsers(){
    this.searchService.searchUsers(this.query)
    .subscribe((response) => {
      if(response){
        if(response.success){
          this.fetchUserDetails(response);
        }
      }
    });
  }

  fetchUserDetails(response){
    this.searchResults = [];
    for(let user of response.result){
      if(user.facebook) {
        user.facebook._id = user._id;
        this.searchResults.push(user.facebook);
      }
      else if(user.google) {
        user.google._id = user._id;
        this.searchResults.push(user.google);
      }
      else this.searchResults.push(user);
    }
    this.detect.detectChanges();
  }

}
