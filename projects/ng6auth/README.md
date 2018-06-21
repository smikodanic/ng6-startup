# ng5plus-auth
> Angular 6 authentication service. This service is used with [Angular router](https://angular.io/guide/router).



## Installation
```bash
$ npm install --save ng5plus-auth

```

### Dependencies
- angular router **@angular/router**
- [ng5plus-cookies](https://github.com/smikodanic/ng5plus-cookies) *(npm i ng5plus-cookies)*


## Integration

**1. app.module.ts**
```javascript
import { AppRoutesModule } from './app-routes.module';
import { CookiesService } from 'ng5plus-cookies';
import { AuthService } from 'ng5plus-auth';

const api_base_url = 'http://localhost:4444/api';

const auth_urls = {
  afterGoodLogin: '/{loggedUserRole}', // {loggedUserRole} -> 'admin' | 'customer'
  afterBadLogin: '/login',
  afterLogout: '/login'
};

const cookie_options = {
  // domain: 'localhost',
  path: '/',
  expires: 3, // expire in 3 days
  // expires: new Date('2018-10-31T03:24:00'),
  secure: false,
  httpOnly: false,
  sameSite: 'strict'
};

@NgModule({
  declarations: [],
  imports: [AppRoutesModule],
  providers: [
    CookiesService,
    AuthService,
    { provide: 'API_BASE_URL', useValue: api_base_url },
    { provide: 'AUTH_URLS', useValue:  auth_urls },
    { provide: 'COOKIE_OPTS', useValue: cookie_options },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
*Notice: {loggedUserRole} is like variable which is replaced with user's role: admin, customer, ... 
User's role have to be returned by API.*


**2. app-routes.module.ts**
```javascript
// modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

// services
import { IsLoggedService, HasRoleService, AutologinService } from 'ng5plus-auth';

// routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AutologinService] },
  { path: 'admin', component: AdminComponent, canActivate: [IsLoggedService, HasRoleService] },
  { path: 'customer', component: CustomerComponent, canActivate: [IsLoggedService, HasRoleService] },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  providers: [IsLoggedService, HasRoleService, AutologinService],
  exports: [ RouterModule ],
  declarations: [
    HomeComponent,
    AdminComponent,
    CustomerComponent,
    NotfoundComponent
  ]
})

export class AppRoutesModule {}
```


## Methods
#### login(creds: Credentials): Observable<any>
Login with const creds = {username: 'xxxx', password: 'yyyy'} and redirect to URL defined by auth_urls.afterGoodLogin.

Required 'creds' properties are:
```javascript
interface Credentials {
  username: string;
  password: string;
}
```

#### logout(): void
Logout and re.

#### getLoggedUserInfo(): LoggedUser
Get logged user info. This object is returned by API and stored into cookie *auth_loggedUser*.

Required user object properties are:
```javascript
interface LoggedUser {
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
```
so API response should return those fields.


#### getJWTtoken(): string
Take JWT token from 'auth_jwtToken' cookie. This token is fetched from API and stored in 'auth_jwtToken' cookie.


## API response
In order to work properly this service requires following JSON response or simmilar:
```json
{
    "success": true,
    "message": "Login was successful. JWT is generated and you can use it in API request header. Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZjdmYTZmMjlmOWJlMTg1MmRkNjMyZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1Mjc5MzYxNjR9.QI78esEzZkxpkuMhWGqPASGvRvrti1GNWM7ozxnvyfU",
    "jwtToken": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZjdmYTZmMjlmOWJlMTg1MmRkNjMyZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1Mjc5MzYxNjR9.QI78esEzZkxpkuMhWGqPASGvRvrti1GNWM7ozxnvyfU",
    "loggedUser": {
        "role": "admin",
        "is_active": true,
        "_id": "5af7fa6f29f9be1852dd632e",
        "first_name": "Marko",
        "last_name": "Adminić",
        "address": "Radića 23",
        "city": "Osijek",
        "country": "Croatia",
        "phone": "+385-93-2111-222",
        "email": "test@uniapi.com",
        "website": "www.uniapi.org",
        "username": "admin",
        "password": "--removed--",
        "created_at": "2018-05-13T08:42:23.363Z",
        "updated_at": "2018-06-02T10:42:44.175Z",
        "__v": 0,
        "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZjdmYTZmMjlmOWJlMTg1MmRkNjMyZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1Mjc5MzYxNjR9.QI78esEzZkxpkuMhWGqPASGvRvrti1GNWM7ozxnvyfU"
    }
}
```

## Method Implementation

### login({username: , password: })
**/pages/login/login.html**
```html
<form id="login-form" action="#" method="POST" novalidate="" [formGroup]="loginFG">
    <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control underlined" placeholder="Your username" required formControlName="username"> </div>
    <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control underlined" placeholder="Your password" required formControlName="password"> </div>
    <div class="form-group">
        <button type="button" class="btn btn-block btn-primary" (click)="login()">Login</button>
    </div>
    <div>
        <p class="alert alert-warning" *ngIf="!!err && !!err.message">{{err.message}}</p>
    </div>
</form>
```

**/pages/login/login.ts**
```javascript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'ng5plus-auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFG: FormGroup;
  err: Error;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.loginFG = this.fb.group({
      username: '',
      password: ''
    });
  }


  login() {
    const creds = this.loginFG.value; // {username: , password: }

    this.authService.login(creds)
      .subscribe((loggedUser: any) => {
        const jwtToken = this.authService.getJWTtoken();
        console.info('LOGGED USER:: ', loggedUser, ' jwtToken=', jwtToken);
      }, (err) => {
        this.err = err.error;
        setTimeout(() => {
          this.err = null;
        }, 2100);
        console.error('ERROR: ', err);
      });
  }

}

```


### logout()
**/pages/admin/admin.html**
```html
<a class="dropdown-item" [routerLink]="" (click)="logout()"><i class="fa fa-power-off icon"></i> Logout </a>
```

**/pages/admin/admin.ts**
```javascript
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng5plus-auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loggedUser: any;

  constructor(private authService: AuthService) {
    this.loggedUser = authService.getLoggedUserInfo();
  }

  ngOnInit() {
  }

  logout() {
    console.log('LOGOUT:: ');
    this.authService.logout();
  }

}
```


## Protections
### Route Gurads
To protect angular routes from unauthorized access this service uses *canActivate* route guards:
- **IsLoggedService** check if user is logged with valid username:password. 
- **HasRoleService** check if user has appropriate role, e.g. role must me contained in URL string, 
  for example: /admin/dashboard is valid for 'admin' role but /customer/dashboard is not valid for 'admin' role.
  This guard must be applied after *IsLoggedService* guard.
- **AutologinService** check if user is already logged. If yes then automatically redirect to URL defined by *auth_urls.afterGoodLogin*.
  This guard should be applied only on **login** page e.g. /login angular route.

### API HTTP Request protections
To protect each API request use JWT Token from 'auth_jwtToken' cookie and use it in HTTP header 'Authorization: JWT <token>' as HTTP interceptor for each API request.





## Example
This npm package is integrated in [ng5plus-startup](https://github.com/smikodanic/ng5plus-startup) so it is full integration example and shows how to use it regularly.



## Licence
Created by [Saša Mikodanić](http://www.mikosoft.info) under MIT licence.
