import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { mimeType } from './mime-type.validator';
import { finalize } from 'rxjs/operators';

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
  imagePreview: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((fetchedPost: Post) => {
          this.post = fetchedPost;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
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
      this.postService
        .updatePost(
          {
            ...this.post,
            title: this.form.value.title,
            content: this.form.value.content
          },
          this.form.value.image
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(data => {
          this.router.navigate(['/']);
        }, console.warn);
    } else {
      this.postService
        .addPost(
          {
            title: this.form.value.title,
            content: this.form.value.content,
            imagePath: null,
            creator: null
          },
          this.form.get('image').value
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          this.router.navigate(['/']);
        }, console.warn);
    }

    this.form.reset();
  }

  onImagePicked(eventData: Event) {
    const file = (eventData.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
    console.log(this.form.get('image'));
  }
}
