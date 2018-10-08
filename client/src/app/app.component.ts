import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  auth$: Observable<boolean>;

  constructor(private authSrv: AuthService) {}

  ngOnInit() {
    this.auth$ = this.authSrv.getAuthenticatedStatus();
    this.authSrv.tryLocalAutoLogin();
  }

  onLogout() {
    this.authSrv.logout();
  }
}
