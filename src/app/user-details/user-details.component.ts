import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from '../services';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetails: any;
  posts: any = [];

  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((routeValue: ParamMap) => {
      this.searchService.getUserDetails(routeValue.get('id'))
      .subscribe((response) => {
        if(response){
          if(response.success){
            if(response.data[0].facebook) this.userDetails = response.data[0].facebook;
            else if(response.data[0].google) this.userDetails = response.data[0].google;
            else this.userDetails = response.data[0];
          }
        }
      });

      this.searchService.getPostsByUserId(routeValue.get('id'))
      .subscribe((response) => {
        if(response){
          if(response.success){
            this.posts = response.data;
          }
        }
      });

    });
  }

}
