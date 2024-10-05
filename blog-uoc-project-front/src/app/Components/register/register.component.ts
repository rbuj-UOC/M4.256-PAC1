import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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

  msgRegister = _('Register');
  msgRegisterName = _('Name');
  msgRegisterSurname1 = _('Surname1');
  msgRegisterSurname2 = _('Surname2');
  msgRegisterAlias = _('Alias');
  msgRegisterBirthDate = _('Birth Date');
  msgRegisterEmail = _('Email');
  msgRegisterPassword = _('Password');
  msgRegisterRegister = _('Register');
  msgRegisterError001 = _('Name must be at least 5 characters long');
  msgRegisterError002 = _('Name can be max 25 characters long');
  msgRegisterError003 = _('Surname1 must be at least 5 characters long');
  msgRegisterError004 = _('Surname1 can be max 25 characters long');
  msgRegisterError005 = _('Surname2 must be at least 5 characters long');
  msgRegisterError006 = _('Surname2 can be max 25 characters long');
  msgRegisterError007 = _('Alias must be at least 5 characters long');
  msgRegisterError008 = _('Alias can be max 25 characters long');
  msgRegisterError009 = _('Name is required');
  msgRegisterError010 = _('Surname1 is required');
  msgRegisterError011 = _('Alias is required');
  msgRegisterError012 = _('Birth date is required');
  msgRegisterError013 = _('Email must be a valid email address');
  msgRegisterError014 = _('Email is required');
  msgRegisterError015 = _('Password is required');
  msgRegisterError016 = _('Password must be at least 8 characters long');

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {
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
