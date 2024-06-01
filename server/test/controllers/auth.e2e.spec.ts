import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { SuperTest, Test as T } from 'supertest';
import * as requestTest from 'supertest';
import { validate } from 'uuid';

import { AppModule } from '@app/app.module';
import { setupConfig } from '@app/app.config';

import { authRoutes } from '../endpoints';
import { deleteTestUser } from '../utils/delete-test-user.util';
import { changeCookieValue } from '../utils/change-cookie-value.util';
import { getUserAndCookies } from '../utils/get-user-and-cookies.util';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let request: SuperTest<T>;
  let userId: string;
  let cookies: string[];
  const signupDto = {
    username: 'user',
    email: 'auth@test.email',
    password: 'P@ssw0rd',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    request = requestTest(app.getHttpServer());
    setupConfig(app);

    await app.init();

    const { user, cookies: authCookies } = await getUserAndCookies({
      request,
      signupDto,
    });

    userId = user.id;
    cookies = authCookies;
  });

  afterAll(async () => {
    if (userId && cookies) {
      await deleteTestUser({ request, userId, cookies });
    }

    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should correctly create user', async () => {
      const signupDto = {
        username: 'username',
        email: 'test@test.mail',
        password: 'TestP@ssw0rd',
      };

      const response = await request
        .post(authRoutes.signup)
        .send({ ...signupDto });

      const {
        body: { id, email, username, version, password, createdAt, updatedAt },
      } = response;

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(validate(id)).toBeTruthy();
      expect(email).toBe(signupDto.email);
      expect(username).toBe(signupDto.username);
      expect(version).toBe(1);
      expect(password).toBeFalsy();
      expect(typeof createdAt).toBe('string');
      expect(createdAt === updatedAt).toBeTruthy();

      const removeResponse = await deleteTestUser({
        request,
        userId: id,
        loginDto: {
          email: signupDto.email,
          password: signupDto.password,
        },
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with 400 status code if the request body is invalid', async () => {
      const invalidDto = {
        username: 'inv@lidName',
        email: 'invalid@email',
        password: 'invalidPassword',
      };

      const validDto = {
        username: 'username',
        email: 'test@email.com',
        password: 'P@ssw0rd',
      };

      const responses = await Promise.all([
        request.post(authRoutes.signup).send(invalidDto),
        request.post(authRoutes.signup).send({ email: validDto.email }),
        request.post(authRoutes.signup).send({ password: validDto.password }),
        request.post(authRoutes.signup).send({ username: validDto.username }),
      ]);

      const allBadRequest = responses.every(
        ({ status }) => status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequest).toBe(true);
    });

    it('should respond with 409 status code if the user already exists', async () => {
      const signupDto = {
        username: 'username',
        email: 'test@test.mail',
        password: 'TestP@ssw0rd',
      };

      const response = await request
        .post(authRoutes.signup)
        .send({ ...signupDto });

      const repeatResponse = await request
        .post(authRoutes.signup)
        .send({ ...signupDto });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(repeatResponse.status).toBe(StatusCodes.CONFLICT);

      const removeResponse = await deleteTestUser({
        request,
        userId: response.body.id,
        loginDto: {
          email: signupDto.email,
          password: signupDto.password,
        },
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);
    });
  });

  describe('POST /auth/signin', () => {
    it('should correctly login user and set cookies', async () => {
      const loginDto = {
        email: signupDto.email,
        password: signupDto.password,
      };

      const response = await request.post(authRoutes.login).send(loginDto);
      const cookies = response.get('Set-Cookie');

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(Array.isArray(cookies)).toBeTruthy();
      expect(cookies.length).toBe(3);
    });

    it('should respond with 403 status code if the invalid password', async () => {
      const loginDto = {
        email: signupDto.email,
        password: 'TestP@ssw0rd',
      };

      const response = await request.post(authRoutes.login).send(loginDto);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with 404 status code if the user don`t exist', async () => {
      const loginDto = {
        email: 'test@notfound.email',
        password: 'TestP@ssw0rd',
      };

      const loginResponse = await request.post(authRoutes.login).send(loginDto);

      expect(loginResponse.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /auth/logout', () => {
    it('should correctly logout user and remove cookies', async () => {
      const expireCookie = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT';

      const logoutResponse = await request
        .patch(authRoutes.logout)
        .set('Cookie', cookies);

      const cookiesAfterLogout = logoutResponse.get('Set-Cookie');
      const allCookiesSetZeroTime = cookiesAfterLogout?.every((cookie) =>
        cookie.includes(expireCookie),
      );

      expect(logoutResponse.status).toBe(StatusCodes.NO_CONTENT);
      expect(cookiesAfterLogout.length).toBe(3);
      expect(allCookiesSetZeroTime).toBeTruthy();
    });
  });

  describe('POST /auth/refresh', () => {
    it('should correctly refresh auth token', async () => {
      const authCookie = 'auth=';

      const cookiesWithoutAuthToken = cookies.filter(
        (cookie) => !cookie.includes(authCookie),
      );

      expect(cookiesWithoutAuthToken.length).toBe(2);

      const refreshResponse = await request
        .post(authRoutes.refresh)
        .set('Cookie', cookiesWithoutAuthToken);
      const newCookies = refreshResponse.get('Set-Cookie');
      const includesAuthCookie = newCookies.some((cookie) =>
        cookie.includes(authCookie),
      );

      expect(refreshResponse.status).toBe(StatusCodes.CREATED);
      expect(newCookies.length).toBe(1);
      expect(includesAuthCookie).toBeTruthy();
    });

    it('should respond with 400 status code if the invalid refresh token', async () => {
      const refreshCookie = 'refresh';
      const cookiesWithInvalidRefresh = changeCookieValue(
        cookies,
        refreshCookie,
      );

      const refreshResponse = await request
        .post(authRoutes.refresh)
        .set('Cookie', cookiesWithInvalidRefresh);

      expect(refreshResponse.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 404 status code if the user not found', async () => {
      const removeResponse = await deleteTestUser({
        request,
        userId,
        cookies,
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const refreshResponse = await request
        .post(authRoutes.refresh)
        .set('Cookie', cookies);

      expect(refreshResponse.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
