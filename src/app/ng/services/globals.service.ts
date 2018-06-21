import { Injectable } from '@angular/core';


@Injectable()
export class GlobalsService {

  private _loggedUser: any;

  constructor() { }

  set loggedUser(u: any) {
    this._loggedUser = u;
  }

  get loggedUser() {
    return this._loggedUser;
  }

}
