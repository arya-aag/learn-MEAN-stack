import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../app-material.module';

import { PostsComponent } from './posts.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsListComponent } from './posts-list/posts-list.component';

@NgModule({
  declarations: [PostsComponent, CreatePostComponent, PostsListComponent],
  imports: [ReactiveFormsModule, AppMaterialModule, CommonModule, RouterModule]
})
export class PostsModule {}
