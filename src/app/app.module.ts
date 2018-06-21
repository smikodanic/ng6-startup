/* MODULES */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // common directives, pipes
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng6cookiesModule } from 'ng6cookies';
import { Ng6authModule, AuthService, IsLoggedService, HasRoleService, AutologinService, JwtTokenInterceptor } from 'ng6auth';


/* SERVICES */
import { GlobalsService } from './ng/services/globals.service';

/* VARS */
import { environment } from '../environments/environment';
// export const API_BASE_URL = new InjectionToken<string>('');


/* COMPONENTS */
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


/* ANGULAR ROUTES */
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AutologinService] },
  { path: 'admin', component: AdminComponent, canActivate: [IsLoggedService, HasRoleService] },
  { path: 'customer', component: CustomerComponent, canActivate: [IsLoggedService, HasRoleService] },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    CustomerComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng6cookiesModule,
    RouterModule.forRoot(routes, { enableTracing: false }),
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    // all required for ng6auth
    AuthService,
    IsLoggedService,
    HasRoleService,
    AutologinService,
    { provide: 'API_BASE_URL', useValue: environment.api_base_url },
    { provide: 'AUTH_URLS', useValue: environment.auth_urls },
    { provide: 'COOKIE_OPTS', useValue: environment.cookie_options },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },

    GlobalsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
