import { Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isValidForm: boolean | null;
  total_likes: number;
  total_dislikes: number;

  msgDashboardDashboard = _('Dashboard');
  msgDashboardTotalLikes = _('Total Likes');
  msgDashboardTotalDislikes = _('Total Dislikes');

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {
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
