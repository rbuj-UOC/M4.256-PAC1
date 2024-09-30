import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent {
  posts!: PostDTO[];

  msgPostList = _('Post List');
  msgPostListID = _('ID');
  msgPostListTITLE = _('TITLE');
  msgPostListDESCRIPTION = _('DESCRIPTION');
  msgPostListNUM_LIKES = _('NUM_LIKES');
  msgPostListNUM_DISLIKES = _('NUM_DISLIKES');
  msgPostListACTIONS = _('ACTIONS');
  msgPostListUPDATE = _('UPDATE');
  msgPostListDELETE = _('DELETE');

  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
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
