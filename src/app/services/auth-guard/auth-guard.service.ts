import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  canActivate(){
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
