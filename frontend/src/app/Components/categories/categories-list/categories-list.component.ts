import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { LocalStorageService } from '../../../Services/local-storage.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-categories-list',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
  categories!: CategoryDTO[] | undefined;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.categories =
          await this.categoryService.getCategoriesByUserId(userId);
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    let errorResponse: any;

    // show confirmation popup
    const result = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      try {
        const rowsAffected =
          await this.categoryService.deleteCategory(categoryId);
        if (rowsAffected === undefined) {
          throw new Error('Couldn`t delete the category');
        }
        if (rowsAffected.affected > 0) {
          this.loadCategories();
        }
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }
}
