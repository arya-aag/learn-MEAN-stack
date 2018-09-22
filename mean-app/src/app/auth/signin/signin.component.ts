import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  isLoading = false;
  showPassword = false;

  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form);
  }
}
