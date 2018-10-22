import { Component, OnInit, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import { SearchService } from '../services/search/search.service';
import { AuthService, IS_AUTH, IS_OAUTH } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Config } from '../app.config';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  config = new Config();
  profileImage: string = "";
  searchState: boolean = false;
  isLoggedOut: boolean = true;
  query: any;

  constructor(private searchService:SearchService, private authService: AuthService, private router: Router, private toastService: MzToastService) { }

  ngOnInit() {
    this.isLoggedOut = this.authService.isTokenExpired();
    if(this.authService.getAuthType() == IS_OAUTH){
      this.authService.getCurrentOAuthUser()
      .then((response: any) => {
        if(response.facebook) this.profileImage = response.facebook.profileImage;
        else if(response.google) this.profileImage = response.google.profileImage;
      }).catch(() => {
        this.profileImage = this.config.defaultProfileImage;
      });
    }
    else this.profileImage = this.config.defaultProfileImage;
  }

  logout(){
    this.authService.logout().subscribe((response) => {
      if(response && response.success){
        this.isLoggedOut = true;
        this.toastService.show('Logged out successfully!', 2000, 'green rounded');
        this.router.navigate(['/home']);
      }
    });
  }

  toggleSearchState(){
    if(this.searchState) this.searchState = false;
    else {
      this.searchState = true;
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 5);
    }
  }

  search(){
    this.router.navigate(['/search-results', this.query]);
  }

}
