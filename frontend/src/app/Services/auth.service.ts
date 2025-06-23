import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthDTO } from '../Models/auth.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private urlBlogUocApi: string;
  private controller: string;

  constructor() {
    this.controller = 'auth';
    this.urlBlogUocApi = environment.apiUrl + '/' + this.controller;
  }

  login(auth: AuthDTO): Promise<AuthToken | undefined> {
    return this.http.post<AuthToken>(this.urlBlogUocApi, auth).toPromise();
  }
}
