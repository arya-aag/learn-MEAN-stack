import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { ServerResponse } from '../common.model';
import { AuthData } from './auth.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.serverUrl;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  getAuthenticatedStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  tryLocalAutoLogin(): boolean {
    const authToken = localStorage.getItem('token');
    this.isAuthenticated$.next(authToken !== null);
    return authToken !== null;
  }

  tryServerAutoLogin(): Observable<boolean> {
    return this.http
      .get<ServerResponse<boolean>>(`${this.apiUrl}/users/autologin`)
      .pipe(
        map(result => result.payload === true),
        catchError(error => of(false))
      );
  }

  createUser(email: string, password: string) {
    const authdata: AuthData = { email, password };
    this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/users/signup`, authdata)
      .subscribe(data => {
        this.router.navigate(['']);
      }, console.log);
  }

  login(email: string, password: string) {
    const authdata: AuthData = { email, password };
    this.http
      .post<ServerResponse<string>>(`${this.apiUrl}/users/login`, authdata)
      .subscribe(response => {
        localStorage.setItem('token', response.payload);
        if (response.payload) {
          this.isAuthenticated$.next(true);
        }
        this.router.navigate(['']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated$.next(false);
    this.router.navigate(['signin']);
  }
}
