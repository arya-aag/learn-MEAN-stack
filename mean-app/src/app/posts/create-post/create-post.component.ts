import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  @Output() createPost: EventEmitter<Post> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onCreatepost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.createPost.emit({
      title: form.value.title,
      details: form.value.details
    });
  }
}
