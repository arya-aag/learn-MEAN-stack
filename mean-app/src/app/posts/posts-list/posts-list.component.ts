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
  isLoading = false;

  constructor (private postService: PostService) {}

  ngOnInit () {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostsAsObs().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  onDeletePost (id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy () {
    this.postsSub.unsubscribe();
  }
}
