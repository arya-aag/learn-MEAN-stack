import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
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
  private postsUpdated$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  private apiUrl = 'http://localhost:3000/api';

  constructor (private http: HttpClient, private router: Router) {}

  getPosts () {
    this.http
      .get<ServerResponse>(`${this.apiUrl}/posts`)
      .pipe(
        map(postData => {
          return postData.payload.map(el => {
            return { title: el.title, content: el.content, id: el._id };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated$.next([...this.posts]);
      });
  }

  getPostsAsObs () {
    return this.postsUpdated$.asObservable();
  }

  getPost (id: string) {
    return this.http.get<ServerResponse>(`${this.apiUrl}/posts/${id}`).pipe(
      map(res => {
        return {
          id: res.payload._id,
          title: res.payload.title,
          content: res.payload.content
        };
      })
    );
  }

  addPost (post: Post) {
    this.http.post<ServerResponse>(`${this.apiUrl}/posts`, post).subscribe(res => {
      console.log(res);
      this.posts.push({ ...post, id: res.payload });
      this.postsUpdated$.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost (post: Post) {
    this.http.put<ServerResponse>(`${this.apiUrl}/posts/${post.id}`, post).subscribe(data => {
      const index = this.posts.findIndex(el => el.id === post.id);
      const updatedPosts = [...this.posts];
      updatedPosts[index] = { ...post };
      this.posts = [...updatedPosts];
      this.postsUpdated$.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost (id: string) {
    this.http.delete<any>(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.postsUpdated$.next([...updatedPosts]);
    });
  }
}
