import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { User } from '@app/shared/models/user.model';
import { AuthService } from './auth.service';
import { ILoginDto, IResetDto, ISignupDto } from '../models/auth.model';

describe('AuthService', () => {
  let authService: AuthService;
  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('singup() should call the POST method with correct url and dto', (done) => {
    const url = 'auth/signup';
    const spyon = jest.spyOn(httpClient, 'post');
    const signupDto: ISignupDto = {
      email: 'tom@gmail.com',
      password: 'P@ssW0rd',
      username: 'Tommy',
    };
    const mockUserData: User = {
      id: 'userId',
      email: signupDto.email,
      username: signupDto.username,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budgetId: 'budgetId',
    };

    authService.signup(signupDto).subscribe((userData) => {
      expect(spyon).toHaveBeenCalledWith(url, signupDto);
      expect(userData).toEqual(mockUserData);
      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'POST',
      url,
    });

    request.flush(mockUserData);
  });

  it('login() should call the POST method with correct url and dto', (done) => {
    const url = 'auth/signin';
    const options = { observe: 'response' };
    const spyon = jest.spyOn(httpClient, 'post');
    const loginDto: ILoginDto = {
      email: 'tom@gmail.com',
      password: 'P@ssW0rd',
    };

    authService.login(loginDto).subscribe(() => {
      expect(spyon).toHaveBeenCalledWith(url, loginDto, options);

      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'POST',
      url,
    });

    request.flush({});
  });

  it('logout() should call the PATCH method with correct url and options', (done) => {
    const url = 'auth/logout';
    const options = { observe: 'response' };
    const spyon = jest.spyOn(httpClient, 'patch');

    authService.logout().subscribe(() => {
      expect(spyon).toHaveBeenCalledWith(url, {}, options);

      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'PATCH',
      url,
    });

    request.flush(false, { status: 204, statusText: '' });
  });

  it('resetPassword() should call the POST method with correct url and dto', (done) => {
    const url = 'auth/reset';
    const options = { observe: 'response' };
    const spyon = jest.spyOn(httpClient, 'post');
    const resetDto: IResetDto = {
      email: 'tom@gmail.com',
    };

    authService.resetPassword(resetDto).subscribe(() => {
      expect(spyon).toHaveBeenCalledWith(url, resetDto, options);

      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'POST',
      url,
    });

    request.flush({});
  });

  it('refreshToken() should call the POST method with correct url', (done) => {
    const url = 'auth/refresh';
    const spyon = jest.spyOn(httpClient, 'post');

    authService.refreshToken().subscribe(() => {
      expect(spyon).toHaveBeenCalledWith(url, {});

      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'POST',
      url,
    });

    request.flush({});
  });

  it('refreshToken() should call the POST method with correct url', (done) => {
    const url = 'auth/refresh';
    const spyon = jest.spyOn(httpClient, 'post');

    authService.refreshToken().subscribe(() => {
      expect(spyon).toHaveBeenCalledWith(url, {});

      done();
    });

    const request: TestRequest = httpController.expectOne({
      method: 'POST',
      url,
    });

    request.flush({});
  });
});
