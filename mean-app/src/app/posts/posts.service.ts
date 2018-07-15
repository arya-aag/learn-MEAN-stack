import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ msg: string; data: Post[] }>('http://localhost:3000/api/posts')
      .subscribe(res => {
        this.posts = res.data;
        this.postsUpdated$.next([...this.posts]);
      });
  }

  getPostsAsObs() {
    return this.postsUpdated$.asObservable();
  }

  addPost(post: Post) {
    this.http
      .post<{ msg: string }>('http://localhost:3000/api/posts', post)
      .subscribe(res => {
        console.log(res.msg);
        this.posts.push(post);
        this.postsUpdated$.next([...this.posts]);
      });
  }
}
