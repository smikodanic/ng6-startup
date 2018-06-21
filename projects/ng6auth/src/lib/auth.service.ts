import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CookiesService } from 'ng6cookies';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// credentials interface
export interface Credentials {
  username: string;
  password: string;
}


// logged user info
export interface LoggedUser {
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  country?: string;

  phone?: string;
  email: string;
  website?: string;

  misc?: any;

  username: string;
  password?: string;

  role: string;
  is_active?: boolean;
  jwt_token?: string;
}




@Injectable()
export class AuthService {

  public jwtToken: string;
  private loggedUser: LoggedUser;

  constructor(
    private http: HttpClient,
    private cookiesService: CookiesService,
    private r: Router,
    @Inject('API_BASE_URL') private api_base_url: string, // http://localhost:4444/api
    @Inject('AUTH_URLS') private auth_urls: any, // {afterGoodLogin: , afterBadLogin: , afterLogout: }
    @Inject('COOKIE_OPTS') private cookieOpts: any, // {path: , expires: , secure: , httpOnly: , sameSite: }
  ) {}




  /**
   * Login with username and password
   * @param creds // credentials object {username: xxx, password: xxx}
   * @return Observable
   */
  login(creds: Credentials): Observable<any> {

    return this.http.post(`${this.api_base_url}/users/login`, creds)
      .do((apiResp: any) => {
        /* set cookie 'auth_jwtToken': 'JWT xyz...' */
        if (!!apiResp && !!apiResp.jwtToken) {
          this.cookiesService.put('auth_jwtToken', apiResp.jwtToken, this.cookieOpts, false);
        }

        /* set cookie 'auth_loggedUser' and class property 'this.loggedUser': {first_name: , last_name: , ...} */
        if (!!apiResp && !!apiResp.loggedUser) {
          this.cookiesService.putObject('auth_loggedUser', apiResp.loggedUser, this.cookieOpts, false);
          this.loggedUser = apiResp.loggedUser;
        }

        /* redirect to URL */
        const afterGoodLoginURL = this.auth_urls.afterGoodLogin.replace('{loggedUserRole}', apiResp.loggedUser.role);
        this.r.navigateByUrl(afterGoodLoginURL);
      })
      .catch((err: Error) => {
        /* remove all cookies */
        this.cookiesService.removeAll(false);

        /* remove loggedUser class property */
        this.loggedUser = null;

        // return error
        return Observable.throw(err);
      });

  }




  /**
   * Logout
   * @return Observable
   */
  logout(): void {
    // delete all cookies
    this.cookiesService.removeAll(false);

    // delete class property
    delete this.loggedUser;

    // redirect
    setTimeout(() => {
      const afterLogoutURL = this.auth_urls.afterLogout;
      this.r.navigateByUrl(afterLogoutURL);
    }, 300);

  }




  /**
   * Get logged user info (from global variables or cookie)
   * @return object - {first_name: , last_name: , ...}
   */
  getLoggedUserInfo(): LoggedUser {
    const loggedUser: LoggedUser = this.loggedUser || this.cookiesService.getObject('auth_loggedUser', false);
    return loggedUser;
  }




  /**
   * Get JWT token from cookie
   * @return string - JWT eyJhbGciOiJIUzI1NiIsInR...
   */
  getJWTtoken(): string {
    const jwtToken: string = this.cookiesService.get('auth_jwtToken', false) || 'JWT ';
    return jwtToken;
  }




}
