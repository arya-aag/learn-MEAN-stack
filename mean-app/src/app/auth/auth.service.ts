import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ServerResponse } from '../common.model';
import { AuthData } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authdata: AuthData = { email, password };
    this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/users/signup`, authdata)
      .subscribe(data => {
        console.log(data);
      });
  }

  login(email: string, password: string) {
    const authdata: AuthData = { email, password };
    this.http
      .post<ServerResponse<string>>(`${this.apiUrl}/users/login`, authdata)
      .subscribe(data => {
        console.log(data);
      });
  }
}
