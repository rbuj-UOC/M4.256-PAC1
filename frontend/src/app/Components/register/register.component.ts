import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { UserDTO } from '../../Models/user.dto';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-register',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private formBuilder = inject(UntypedFormBuilder);
  private userService = inject(UserService);
  private sharedService = inject(SharedService);
  private headerMenusService = inject(HeaderMenusService);
  private router = inject(Router);

  registerUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;

  constructor() {
    this.registerUser = new UserDTO('', '', '', '', new Date(), '', '');
    this.isValidForm = null;
    this.name = new FormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_1 = new FormControl(this.registerUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_2 = new FormControl(this.registerUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.alias = new FormControl(this.registerUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.birth_date = new FormControl(
      formatDate(this.registerUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );
    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);
    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password
    });
  }

  async register(): Promise<void> {
    let responseOK = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    try {
      await this.userService.register(this.registerUser);
      responseOK = true;
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true
      };
      this.headerMenusService.headerManagement.next(headerInfo);

      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'registerFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      // Reset the form
      this.registerForm.reset();
      // After reset form we set birthDate to today again (is an example)
      this.birth_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      this.router.navigateByUrl('home');
    }
  }
}
