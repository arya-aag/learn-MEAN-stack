import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from '../../../../node_modules/rxjs';
import { PageEvent } from '@angular/material';

import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { AuthService } from '../../auth/auth.service';

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
  isAuth$: Observable<boolean>;
  userId: string;

  constructor(private postService: PostService, private authSrv: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authSrv.getUserId(); // this should be made 'null' on logout
    this.postService.getPosts(this.postsPerPage, 0);
    this.postsSub = this.postService.getPostsAsObs().subscribe(postsData => {
      this.posts = postsData.posts;
      this.totalPosts = postsData.count;
      this.isLoading = false;
    });
    this.isAuth$ = this.authSrv.getAuthenticatedStatus();
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
