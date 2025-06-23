import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';

@Component({
  selector: 'app-header',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private headerMenusService = inject(HeaderMenusService);
  private localStorageService = inject(LocalStorageService);

  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor() {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.localStorageService.remove('user_id');
    this.localStorageService.remove('access_token');
    const headerInfo = {
      showAuthSection: false,
      showNoAuthSection: true
    } as HeaderMenus;
    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('home');
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }
}
