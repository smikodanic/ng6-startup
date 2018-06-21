import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { IsLoggedService } from './routeGuards/isLogged.service';
import { HasRoleService } from './routeGuards/hasRole.service';
import { AutologinService } from './routeGuards/autoLogin.service';
import { JwtTokenInterceptor } from './jwtTokenInterceptor.service';


@NgModule({
  imports: [],
  declarations: [],
  providers: [
    AuthService,
    IsLoggedService,
    HasRoleService,
    AutologinService,
    JwtTokenInterceptor
  ],
  exports: []
})
export class Ng6authModule { }
