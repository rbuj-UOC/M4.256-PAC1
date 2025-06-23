import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { PostDTO } from '../Models/post.dto';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);

  private urlBlogUocApi: string;
  private controller: string;

  constructor() {
    this.controller = 'posts';
    this.urlBlogUocApi = environment.apiUrl + '/' + this.controller;
  }

  getPosts(): Promise<PostDTO[] | undefined> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi).toPromise();
  }

  getPostsByUserId(userId: string) {
    return this.http
      .get<PostDTO[]>(environment.apiUrl + '/users/posts/' + userId)
      .toPromise();
  }

  createPost(post: PostDTO): Promise<PostDTO | undefined> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post).toPromise();
  }

  getPostById(postId: string): Promise<PostDTO | undefined> {
    return this.http
      .get<PostDTO>(this.urlBlogUocApi + '/' + postId)
      .toPromise();
  }

  updatePost(postId: string, post: PostDTO): Promise<PostDTO | undefined> {
    return this.http
      .put<PostDTO>(this.urlBlogUocApi + '/' + postId, post)
      .toPromise();
  }

  likePost(postId: string): Promise<updateResponse | undefined> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/like/' + postId, NONE_TYPE)
      .toPromise();
  }

  dislikePost(postId: string): Promise<updateResponse | undefined> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/dislike/' + postId, NONE_TYPE)
      .toPromise();
  }

  deletePost(postId: string): Promise<deleteResponse | undefined> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + postId)
      .toPromise();
  }
}
