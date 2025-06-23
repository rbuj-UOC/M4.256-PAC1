/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { LocalStorageService } from '../../../Services/local-storage.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-category-form',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private sharedService = inject(SharedService);
  private localStorageService = inject(LocalStorageService);

  category: CategoryDTO | undefined;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;

  constructor() {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55)
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255)
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7)
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    // update
    if (this.categoryId) {
      this.isUpdateMode = true;
      try {
        this.category = await this.categoryService.getCategoryById(
          this.categoryId
        );

        if (this.category === undefined) {
          throw new Error('Couldn`t retrieve the category');
        }

        this.title.setValue(this.category.title);
        this.description.setValue(this.category.description);
        this.css_color.setValue(this.category.css_color);
        this.categoryForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          css_color: this.css_color
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async editCategory(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.categoryId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        try {
          if (this.category === undefined) {
            throw new Error('The category is undefined');
          }
          this.category.userId = userId;
          await this.categoryService.updateCategory(
            this.categoryId,
            this.category
          );
          responseOK = true;
        } catch (error: any) {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }

        await this.sharedService.managementToast(
          'categoryFeedback',
          responseOK,
          errorResponse
        );

        if (responseOK) {
          this.router.navigateByUrl('categories');
        }
      }
    }
    return responseOK;
  }

  private async createCategory(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        if (this.category === undefined) {
          throw new Error('The category is undefined');
        }
        this.category.userId = userId;
        await this.categoryService.createCategory(this.category);
        responseOK = true;
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }

      await this.sharedService.managementToast(
        'categoryFeedback',
        responseOK,
        errorResponse
      );

      if (responseOK) {
        this.router.navigateByUrl('categories');
      }
    }

    return responseOK;
  }

  async saveCategory() {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      this.validRequest = await this.editCategory();
    } else {
      this.validRequest = await this.createCategory();
    }
  }
}
