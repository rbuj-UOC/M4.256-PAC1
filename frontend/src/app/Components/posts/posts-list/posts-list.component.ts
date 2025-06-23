import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from '../../../Models/post.dto';
import { LocalStorageService } from '../../../Services/local-storage.service';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-posts-list',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent {
  private postService = inject(PostService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private sharedService = inject(SharedService);

  posts!: PostDTO[] | undefined;

  constructor() {
    this.loadPosts();
  }

  private async loadPosts(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.posts = await this.postService.getPostsByUserId(userId);
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  async deletePost(PostId: string): Promise<void> {
    let errorResponse: any;

    // show confirmation popup
    const result = confirm('Confirm delete post with id: ' + PostId + ' .');
    if (result) {
      try {
        const rowsAffected = await this.postService.deletePost(PostId);
        if (rowsAffected === undefined) {
          throw new Error('Couldn`t retrieve rowsAffected');
        }
        if (rowsAffected.affected > 0) {
          this.loadPosts();
        }
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }
}
