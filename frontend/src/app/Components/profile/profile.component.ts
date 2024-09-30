import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { UserDTO } from 'src/app/Models/user.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  profileForm: FormGroup;
  isValidForm: boolean | null;

  msgProfile = _('Profile');
  msgProfileName = _('Name');
  msgProfileSurname1 = _('Surname1');
  msgProfileSurname2 = _('Surname2');
  msgProfileAlias = _('Alias');
  msgProfileBirthDate = _('Birth Date');
  msgProfileEmail = _('Email');
  msgProfilePassword = _('Password');
  msgProfileUpdate = _('Update');
  msgProfileError001 = _('Name is required');
  msgProfileError002 = _('Name must be at least 5 characters long');
  msgProfileError003 = _('Name can be max 25 characters long');
  msgProfileError004 = _('Surname1 is required');
  msgProfileError005 = _('Surname1 must be at least 5 characters long');
  msgProfileError006 = _('Surname1 can be max 25 characters long');
  msgProfileError007 = _('Surname2 must be at least 5 characters long');
  msgProfileError008 = _('Surname2 can be max 25 characters long');
  msgProfileError009 = _('Alias is required');
  msgProfileError010 = _('Alias must be at least 5 characters long');
  msgProfileError011 = _('Alias can be max 25 characters long');
  msgProfileError012 = _('Birth date is required');
  msgProfileError013 = _('Email is required');
  msgProfileError014 = _('Email must be a valid email address');
  msgProfileError015 = _('Password is required');
  msgProfileError016 = _('Password must be at least 8 characters long');

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.profileUser = new UserDTO('', '', '', '', new Date(), '', '');
    this.isValidForm = null;
    this.name = new FormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_1 = new FormControl(this.profileUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_2 = new FormControl(this.profileUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.alias = new FormControl(this.profileUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.birth_date = new FormControl(
      formatDate(this.profileUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );
    this.email = new FormControl(this.profileUser.email, [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl(this.profileUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);
    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    // load user data
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        const userData = await this.userService.getUSerById(userId);

        this.name.setValue(userData.name);
        this.surname_1.setValue(userData.surname_1);
        this.surname_2.setValue(userData.surname_2);
        this.alias.setValue(userData.alias);
        this.birth_date.setValue(
          formatDate(userData.birth_date, 'yyyy-MM-dd', 'en')
        );
        this.email.setValue(userData.email);

        this.profileForm = this.formBuilder.group({
          name: this.name,
          surname_1: this.surname_1,
          surname_2: this.surname_2,
          alias: this.alias,
          birth_date: this.birth_date,
          email: this.email,
          password: this.password
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  async updateUser(): Promise<void> {
    let responseOK = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    const userId = this.localStorageService.get('user_id');

    if (userId) {
      try {
        await this.userService.updateUser(userId, this.profileUser);
        responseOK = true;
      } catch (error: any) {
        responseOK = false;
        errorResponse = error.error;

        this.sharedService.errorLog(errorResponse);
      }
    }

    await this.sharedService.managementToast(
      'profileFeedback',
      responseOK,
      errorResponse
    );
  }
}
