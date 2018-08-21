import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

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

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ msg: string; data: any[] }>(`${this.apiUrl}/posts`)
      .pipe(
        map(postData => {
          return postData.data.map(el => {
            return { title: el.title, content: el.content, id: el._id };
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
    const post = this.posts.find(p => p.id === id);
    return { ...post };
  }

  addPost(post: Post) {
    this.http.post<ServerResponse>(`${this.apiUrl}/posts`, post).subscribe(res => {
      console.log(res);
      this.posts.push({ ...post, id: res.payload });
      this.postsUpdated$.next([...this.posts]);
    });
  }

  updatePost(post: Post) {
    this.http.put<ServerResponse>(`${this.apiUrl}/posts/${post.id}`, post).subscribe(data => {
      console.log(data);
    });
  }

  deletePost(id: string) {
    this.http.delete<any>(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.postsUpdated$.next([...updatedPosts]);
    });
  }
}
