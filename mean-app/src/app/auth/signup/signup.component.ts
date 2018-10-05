import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
      .createUser(form.value.email, form.value.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(result => {
        this.router.navigate(['signin']);
      }, console.warn);
  }
}
