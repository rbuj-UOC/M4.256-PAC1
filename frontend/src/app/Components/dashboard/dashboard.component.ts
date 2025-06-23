import { Component, inject } from '@angular/core';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-dashboard',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private postService = inject(PostService);
  private sharedService = inject(SharedService);

  isValidForm: boolean | null;
  total_likes: number;
  total_dislikes: number;

  constructor() {
    this.isValidForm = null;
    this.total_likes = 0;
    this.total_dislikes = 0;
    this.loadStats();
  }

  private async loadStats(): Promise<void> {
    let errorResponse: any;
    try {
      const posts = await this.postService.getPosts();
      if (posts) {
        for (const p of posts) {
          this.total_likes += p.num_likes;
          this.total_dislikes += p.num_dislikes;
        }
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }
}
