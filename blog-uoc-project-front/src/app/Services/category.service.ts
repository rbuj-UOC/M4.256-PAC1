import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Promise<CategoryDTO[] | undefined> {
    return this.http
      .get<CategoryDTO[]>('http://localhost:3000/users/categories/' + userId)
      .toPromise();
  }

  createCategory(category: CategoryDTO): Promise<CategoryDTO | undefined> {
    return this.http
      .post<CategoryDTO>(this.urlBlogUocApi, category)
      .toPromise();
  }

  getCategoryById(categoryId: string): Promise<CategoryDTO | undefined> {
    return this.http
      .get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId)
      .toPromise();
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Promise<CategoryDTO | undefined> {
    return this.http
      .put<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId, category)
      .toPromise();
  }

  deleteCategory(categoryId: string): Promise<deleteResponse | undefined> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId)
      .toPromise();
  }
}
