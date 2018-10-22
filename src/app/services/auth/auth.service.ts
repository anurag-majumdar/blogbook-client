import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../app.config';
import * as jwt_decode from 'jwt-decode';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { AuthHttp } from 'angular2-jwt';

export const IS_OAUTH: string = "IS_OAUTH";
export const IS_AUTH: string = "IS_AUTH";

declare const FB : any;
declare const gapi: any;

@Injectable()
export class AuthService {

  config = new Config();
  url = this.config.API_URL_PROD;

  constructor(private http: Http, private authHttp: AuthHttp) { }
  
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers, withCredentials: true });

  //====================== Token Settings ================================//

  setAuthType(authType: string){
    localStorage.setItem('AUTH_TYPE', authType);
  }

  getAuthType(): string{
    return localStorage.getItem('AUTH_TYPE');
  }

  removeAuthType(): void{
    localStorage.removeItem('AUTH_TYPE');
  }

  getToken(): string {
    return localStorage.getItem('TOKEN_NAME');
  }

  setToken(token: string): void {
    localStorage.setItem('TOKEN_NAME', token);
  }

  removeToken(): void {
    localStorage.removeItem('TOKEN_NAME');
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(): boolean {
    let token = this.getToken();
    if(token == null) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  //============================ OAuth Settings ================================//

  googleLogIn(){
    var self = this;
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          "client_id": this.config.GOOGLE_CLIENT_ID
        });
        let googleAuth = gapi.auth2.getAuthInstance();
        googleAuth.then(() => {
          googleAuth.signIn().then(googleUser => {
            var authResponse = googleUser.getAuthResponse(true);
            if(authResponse){
              return this.http.post(this.url + "/google-auth/google", {access_token: authResponse.access_token})
              .toPromise()
              .then(response => {
                var token = response.headers.get('x-auth-token');
                if (token) {
                  this.setToken(token);
                }
                resolve(response.json());
              })
              .catch(() => reject());
            }
            else reject();
          });
        });
      });
    });
  }

  facebookLogIn(){
    FB.init({
      "appId": this.config.FACEBOOK_CLIENT_ID,
      "status": false,
      "cookie": false,
      "xfbml": false,
      "version": "v2.10"
    });

    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          return this.http.post(this.url + "/fb-auth/facebook", {access_token: result.authResponse.accessToken})
              .toPromise()
              .then(response => {
                var token = response.headers.get('x-auth-token');
                if (token) {
                  this.setToken(token);
                }
                resolve(response.json());
              })
              .catch(() => reject());
        } 
        else reject();
      }, {scope: 'public_profile, email'})
    });

  }

  getCurrentOAuthUser() {
    return new Promise((resolve, reject) => {
      return this.authHttp.get(this.url + "/oauth/profile").toPromise().then(response => {
        resolve(response.json());
      }).catch(() => reject());
    });
  }

  updateOAuthUserDetails(userId, userDetails){
    return this.authHttp.put(this.url + "/oauth/profile/update/" + userId, userDetails).map(response => response.json());
  }

  //============================ Normal User Auth Settings ================================//

  registerUser(user){
    return this.http.post(this.url + '/users/register', JSON.stringify(user), { headers: this.headers}).map(response => response.json());
  }

  loginUser(loginUser){
    return this.http.post(this.url + '/users/login', JSON.stringify(loginUser), this.options).map(response => response.json());
  }

  getUserDetails(){
    let headers = new Headers({'x-access-token': this.getToken()});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(this.url + '/users/profile', options).map(response => response.json());
  }

  updateUserDetails(userDetails){
    let headers = new Headers({'x-access-token': this.getToken(), 'Content-Type':'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url + '/users/profile/update', JSON.stringify(userDetails), options).map(response => response.json());
  }

  logout(){
    let headers = new Headers({'x-access-token': this.getToken()});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.removeToken();
    this.removeAuthType();
    return this.http.get(this.url + '/users/logout', options).map(response => response.json());
  }

}
