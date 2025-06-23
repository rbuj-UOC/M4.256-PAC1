import { Component, OnInit, inject } from '@angular/core';
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
export class HomeComponent implements OnInit {
  private postService = inject(PostService);
  private localStorageService = inject(LocalStorageService);
  private sharedService = inject(SharedService);
  private router = inject(Router);
  private headerMenusService = inject(HeaderMenusService);

  posts!: PostDTO[] | undefined;
  showButtons: boolean;

  constructor() {
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
