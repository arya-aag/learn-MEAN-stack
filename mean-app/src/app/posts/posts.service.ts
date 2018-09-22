import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

export interface ServerResponse {
  message: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated$: Subject<Post[]> = new Subject<Post[]>();
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<ServerResponse>(`${this.apiUrl}/posts`)
      .pipe(
        map(postData => {
          return postData.payload.map(el => {
            return { ...el, id: el._id };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated$.next([...this.posts]);
      });
  }

  getPostsAsObs() {
    return this.postsUpdated$.asObservable();
  }

  getPost(id: string) {
    return this.http.get<ServerResponse>(`${this.apiUrl}/posts/${id}`).pipe(
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
      .post<{
        message: string;
        payload: Post;
      }>(`${this.apiUrl}/posts`, postData)
      .subscribe(res => {
        console.log(res);
        this.posts.push({ ...post, ...res.payload });
        this.postsUpdated$.next([...this.posts]);
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
      .put<ServerResponse>(`${this.apiUrl}/posts/${post.id}`, postData)
      .subscribe(data => {
        const index = this.posts.findIndex(el => el.id === post.id);
        const updatedPosts = [...this.posts];
        updatedPosts[index] = { ...post };
        this.posts = [...updatedPosts];
        this.postsUpdated$.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete<any>(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = [...updatedPosts];
      this.postsUpdated$.next([...this.posts]);
    });
  }
}
