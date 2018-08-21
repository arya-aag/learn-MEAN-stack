import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

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

  addPost(post: Post) {
    this.http.post<{ message: string; payload: string }>(`${this.apiUrl}/posts`, post).subscribe(res => {
      console.log(res);
      this.posts.push({ ...post, id: res.payload });
      this.postsUpdated$.next([...this.posts]);
    });
  }

  deletePost(id: string) {
    this.http.delete<any>(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.postsUpdated$.next([...updatedPosts]);
    });
  }
}
