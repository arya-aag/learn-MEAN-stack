import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from '../../../../node_modules/rxjs';
import { PageEvent } from '@angular/material';

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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 2, 5, 10];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, 0);
    this.postsSub = this.postService.getPostsAsObs().subscribe(postsData => {
      this.posts = postsData.posts;
      this.totalPosts = postsData.count;
      this.isLoading = false;
    });
  }

  onDeletePost(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChange(event: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
