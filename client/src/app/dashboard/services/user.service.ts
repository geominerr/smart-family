import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, UserUpdateDto } from '@app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_ENDPOINT: string = 'user';

  constructor(private httpClient: HttpClient) {}

  getUser(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.get<User>(endpoint);
  }

  updateUser(id: string, dto: UserUpdateDto) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.patch<User>(endpoint, { ...dto });
  }

  deleteUser(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.delete(endpoint);
  }
}
