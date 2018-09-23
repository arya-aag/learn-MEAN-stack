import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  showPassword = false;

  constructor(private authSrv: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    this.authSrv.createUser(form.value.email, form.value.password);
  }
}
