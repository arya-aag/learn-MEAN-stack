import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { ServerResponse } from '../common.model';
import { environment } from '../../environments/environment';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated$ = new Subject<{ posts: Post[]; count: number }>();
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, pageIndex: number) {
    const queryParams = `?size=${pageSize}&index=${pageIndex}`;
    this.http
      .get<ServerResponse<{ count: number; posts: Post[] }>>(
        `${this.apiUrl}/posts${queryParams}`
      )
      .subscribe(data => {
        console.log(data);
        this.posts = data.payload.posts.map(el => {
          return { ...el, id: el._id };
        });
        this.postsUpdated$.next({ posts: [...this.posts], count: data.payload.count });
      });
  }

  getPostsAsObs() {
    return this.postsUpdated$.asObservable();
  }

  getPost(id: string) {
    return this.http.get<ServerResponse<Post>>(`${this.apiUrl}/posts/${id}`).pipe(
      map(res => {
        return {
          ...res.payload,
          id: res.payload._id
        };
      })
    );
  }

  addPost(post: Post, image: File | string) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http
      .post<ServerResponse<Post>>(`${this.apiUrl}/posts`, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    if (typeof image === 'object') {
      postData.append('image', image, post.title);
    } else {
      postData.append('imagePath', image);
    }
    this.http
      .put<ServerResponse<any>>(`${this.apiUrl}/posts/${post.id}`, postData)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<ServerResponse<string>>(`${this.apiUrl}/posts/${id}`);
  }
}
