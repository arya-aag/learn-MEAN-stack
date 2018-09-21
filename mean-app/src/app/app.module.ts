import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppMaterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostService } from './posts/posts.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, PostsComponent, CreatePostComponent, PostsListComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule {}
