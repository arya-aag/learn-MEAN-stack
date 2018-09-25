import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ServerResponse } from '../common.model';
import { AuthData } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.serverUrl;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getAuthenticatedStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

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
      .subscribe(response => {
        console.log(response);
        localStorage.setItem('token', response.payload);
        if (response.payload) {
          this.isAuthenticated$.next(true);
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated$.next(false);
  }
}
