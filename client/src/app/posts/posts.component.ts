import { Component, OnInit } from '@angular/core';

import { Post } from './post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  postsList: Post[] = [];

  constructor() {}

  ngOnInit() {}

  onCreatePost(post: Post) {
    this.postsList.push(post);
  }
}
