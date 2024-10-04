import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  user_categories!: CategoryDTO[];
  post: PostDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  msgPostForm = _('Post Form');
  msgPostFormTitle = _('Title');
  msgPostFormDescription = _('Description');
  msgPostFormPublicationDate = _('Publication Date');
  msgPostFormCategories = _('Categories');
  msgPostFormSAVE = _('SAVE');
  msgPostFormError001 = _('Title is required');
  msgPostFormError002 = _('Title can be max 55 characters long');
  msgPostFormError003 = _('Description is required');
  msgPostFormError004 = _('Description can be max 255 characters long');
  msgPostFormError005 = _('Publication Date is required');

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55)
    ]);

    this.description = new UntypedFormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255)
    ]);

    this.publication_date = new UntypedFormControl(
      formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.categories = new UntypedFormControl(this.post.categories);

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    this.loadCategories();

    // update
    if (this.postId) {
      this.isUpdateMode = true;
      try {
        this.post = await this.postService.getPostById(this.postId);
        this.title.setValue(this.post.title);
        this.description.setValue(this.post.description);
        this.publication_date.setValue(
          formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
        );
        this.categories.setValue(this.post.categories.map((c) => c.categoryId));
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async loadCategories(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.user_categories =
          await this.categoryService.getCategoriesByUserId(userId);
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async editPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK = false;
    if (this.postId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.post.userId = userId;
        try {
          await this.postService.updatePost(this.postId, this.post);
          responseOK = true;
        } catch (error: any) {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }

        await this.sharedService.managementToast(
          'postFeedback',
          responseOK,
          errorResponse
        );

        if (responseOK) {
          this.router.navigateByUrl('posts');
        }
      }
    }
    return responseOK;
  }

  private async createPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.post.userId = userId;
      try {
        await this.postService.createPost(this.post);
        responseOK = true;
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }

      await this.sharedService.managementToast(
        'postFeedback',
        responseOK,
        errorResponse
      );

      if (responseOK) {
        this.router.navigateByUrl('posts');
      }
    }

    return responseOK;
  }

  async savePost() {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.post = this.postForm.value;

    if (this.isUpdateMode) {
      this.validRequest = await this.editPost();
    } else {
      this.validRequest = await this.createPost();
    }
  }
}
