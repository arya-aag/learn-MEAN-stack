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
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getAuthenticatedStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getUserId(): string {
    return localStorage.getItem('userId');
  }

  tryLocalAutoLogin(): boolean {
    const authToken = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expiration');
    let isSessionValid = false;
    if (authToken && expireDate) {
      const expiresIn = new Date(expireDate).getTime() - new Date().getTime();
      isSessionValid = expiresIn > 0;
      if (isSessionValid) {
        this.resetSessionTimer(expiresIn / 1000);
      }
    }
    this.isAuthenticated$.next(isSessionValid);
    return isSessionValid;
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
        this.router.navigate(['signin']);
      }, console.log);
  }

  login(email: string, password: string) {
    const authdata: AuthData = { email, password };
    this.http
      .post<ServerResponse<{ token: string; expiresIn: number; userId: string }>>(
        `${this.apiUrl}/users/login`,
        authdata
      )
      .subscribe(response => {
        const expiresInSeconds = response.payload.expiresIn;
        const expireDate = new Date(new Date().getTime() + expiresInSeconds * 1000);
        localStorage.setItem('expiration', expireDate.toISOString());
        this.resetSessionTimer(expiresInSeconds);

        localStorage.setItem('token', response.payload.token);
        if (response.payload.token) {
          this.isAuthenticated$.next(true);
        }

        localStorage.setItem('userId', response.payload.userId);

        this.router.navigate(['']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    this.isAuthenticated$.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['signin']);
  }

  private resetSessionTimer(expiresInSeconds: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInSeconds * 1000);
  }
}
