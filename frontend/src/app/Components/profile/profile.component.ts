import { formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { UserDTO } from '../../Models/user.dto';
import { LocalStorageService } from '../../Services/local-storage.service';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-profile',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private userService = inject(UserService);
  private sharedService = inject(SharedService);
  private localStorageService = inject(LocalStorageService);

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

  constructor() {
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
        if (userData === undefined) {
          throw new Error('Couldn`t retrieve user data');
        }

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
