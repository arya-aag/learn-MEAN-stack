import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  isLoading = false;
  showPassword = false;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authSrv
      .login(form.value.email, form.value.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(response => this.router.navigate(['']), console.warn);
  }
}
