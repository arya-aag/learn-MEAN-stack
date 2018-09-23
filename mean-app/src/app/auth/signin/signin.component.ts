import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  isLoading = false;
  showPassword = false;

  constructor(private authSrv: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form);
    this.authSrv.login(form.value.email, form.value.password);
  }
}
