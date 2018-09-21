import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators
} from '../../../../node_modules/@angular/forms';
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
  form: FormGroup;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((fetchedPost: Post) => {
          this.post = fetchedPost;
          this.form.setValue({ title: this.post.title, content: this.post.content });
          this.isLoading = false;
        });
      } else {
        this.postId = null;
      }
    });
  }

  onSubmitPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.postId !== null) {
      this.postService.updatePost({
        ...this.post,
        title: this.form.value.title,
        content: this.form.value.content
      });
    } else {
      this.postService.addPost({
        title: this.form.value.title,
        content: this.form.value.content
      });
    }

    this.form.reset();
  }
}
