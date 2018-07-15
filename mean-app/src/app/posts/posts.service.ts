import { Injectable } from '../../../node_modules/@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  getPosts() {
    return [...this.posts];
  }

  getPostsAsObs() {
    return this.postsUpdated$.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postsUpdated$.next([...this.posts]);
  }
}
