import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    @Inject('BACKEND_URL') private readonly BACKEND_URL: string,
    private readonly http: HttpClient
  ) {}

  getUserInfo() {
    return this.http.get<User>(this.BACKEND_URL + '/user-info');
  }

  getUserImage() {
    return this.http.get<Buffer>(this.BACKEND_URL + '/user-image');
  }
}
