import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from '../../../../node_modules/rxjs';

import { PostService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.postService.getPostsAsObs().subscribe(posts => {
      this.posts = posts;
    });
  }

  onDeletePost(id: string) {
    console.log('onDeletePost', id);
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
