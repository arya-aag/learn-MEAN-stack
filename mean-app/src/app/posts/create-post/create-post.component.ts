import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
  })
export class CreatePostComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  postId: string = null;
  post: Post;
  isLoading = false;

  constructor (private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit () {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((fetchedPost: Post) => {
          this.post = fetchedPost;
          this.isLoading = false;
        });
      } else {
        this.postId = null;
      }
    });
  }

  onSubmitPost (form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.postId !== null) {
      this.postService.updatePost({
        ...this.post,
        title: form.value.title,
        content: form.value.details
      });
    } else {
      this.postService.addPost({
        title: form.value.title,
        content: form.value.details
      });
    }

    form.resetForm();
  }
}
