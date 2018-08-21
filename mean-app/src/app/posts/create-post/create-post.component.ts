import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  constructor(private postService: PostService) {}

  ngOnInit() {}

  onCreatepost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.addPost({
      title: form.value.title,
      content: form.value.details
    });
    form.resetForm();
  }
}
