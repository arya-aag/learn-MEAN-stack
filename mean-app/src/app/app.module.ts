import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMAterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostService } from './posts/posts.service';

@NgModule({
  declarations: [AppComponent, PostsComponent, CreatePostComponent, PostsListComponent],
  imports: [BrowserModule, FormsModule, BrowserAnimationsModule, AppMAterialModule],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule {}
