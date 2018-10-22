import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { PostService, PaginationService, AuthService, AuthGuardService, SearchService } from './';

export function getAuthHttp(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-auth-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('TOKEN_NAME')),
  }), http);
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ 
    PostService, 
    PaginationService, 
    AuthService,
    SearchService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [ Http ]
    }
  ],
  declarations: []
})
export class ServicesModule { }
