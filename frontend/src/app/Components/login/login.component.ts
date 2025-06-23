import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from '../../Models/auth.dto';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { AuthService } from '../../Services/auth.service';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-login',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private formBuilder = inject(UntypedFormBuilder);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private headerMenusService = inject(HeaderMenusService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  loginUser: AuthDTO;
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor() {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new FormControl(this.loginUser.email, [
      Validators.required,
      Validators.email
    ]);

    this.password = new FormControl(this.loginUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  async login(): Promise<void> {
    let responseOK = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
    try {
      const authToken = await this.authService.login(this.loginUser);
      if (authToken === undefined) {
        throw new Error('Couldn`t retrieve the authToken');
      }
      responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;
      // save token to local storage for next requests
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token);
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;
      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true
      };
      this.headerMenusService.headerManagement.next(headerInfo);

      this.sharedService.errorLog(error.error);
    }

    await this.sharedService.managementToast(
      'loginFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false
      };
      // update options menu
      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigateByUrl('home');
    }
  }
}
