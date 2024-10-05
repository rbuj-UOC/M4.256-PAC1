import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  msgHeaderHome = _('Home');
  msgHeaderDashboard = _('Dashboard');
  msgHeaderAdminPosts = _('Admin posts');
  msgHeaderAdminCategories = _('Admin categories');
  msgHeaderProfile = _('Profile');
  msgHeaderLogout = _('Logout');
  msgHeaderRegister = _('Register');
  msgHeaderLogin = _('Login');

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService
  ) {
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
