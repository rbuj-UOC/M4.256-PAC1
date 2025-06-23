import { formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { PostDTO } from '../../../Models/post.dto';
import { CategoryService } from '../../../Services/category.service';
import { LocalStorageService } from '../../../Services/local-storage.service';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-post-form',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private postService = inject(PostService);
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private sharedService = inject(SharedService);
  private localStorageService = inject(LocalStorageService);
  private categoryService = inject(CategoryService);

  user_categories!: CategoryDTO[] | undefined;
  post: PostDTO | undefined;
  title: UntypedFormControl;
  description: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  constructor() {
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
        if (this.post == undefined) {
          throw new Error('Couldn`t retrieve the post');
        }
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
        try {
          if (this.post == undefined) {
            throw new Error('The post is undefined');
          }
          this.post.userId = userId;
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
      try {
        if (this.post == undefined) {
          throw new Error('The post is undefined');
        }
        this.post.userId = userId;
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
