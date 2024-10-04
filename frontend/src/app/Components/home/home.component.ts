import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { PostDTO } from '../../Models/post.dto';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-home',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  posts!: PostDTO[] | undefined;
  showButtons: boolean;

  constructor(
    private postService: PostService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.showButtons = false;
    this.loadPosts();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }
  private async loadPosts(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    this.showButtons = userId !== null;
    try {
      this.posts = await this.postService.getPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  async like(postId: string): Promise<void> {
    let errorResponse: any;
    try {
      await this.postService.likePost(postId);
      this.loadPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  async dislike(postId: string): Promise<void> {
    let errorResponse: any;
    try {
      await this.postService.dislikePost(postId);
      this.loadPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }
}
