import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { SuperTest, Test as T } from 'supertest';
import * as requestTest from 'supertest';
import { validate } from 'uuid';
import { randomUUID } from 'crypto';

import { AppModule } from '@app/app.module';
import { setupConfig } from '@app/app.config';

import { userRoutes } from '../endpoints';
import { deleteTestUser } from '../utils/delete-test-user.util';
import { getUserAndCookies } from '../utils/get-user-and-cookies.util';

describe('User (e2e)', () => {
  let app: INestApplication;
  let request: SuperTest<T>;
  let userId: string;
  let cookies: string[];
  const signupDto = {
    username: 'user',
    email: 'user@email.com',
    password: 'P@sSw0rd',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    request = requestTest(app.getHttpServer());
    setupConfig(app);

    await app.init();
  });

  afterAll(async () => {
    if (userId && cookies) {
      await deleteTestUser({ request, userId, cookies });
    }

    await app.close();
  });

  describe('GET /user/:id', () => {
    beforeAll(async () => {
      const { user, cookies: authCookies } = await getUserAndCookies({
        request,
        signupDto,
      });
      userId = user.id;
      cookies = authCookies;
    });

    it('should get user data coorectly', async () => {
      const response = await request
        .get(userRoutes.get(userId))
        .set('Cookie', cookies);

      const {
        body: {
          id,
          email,
          username,
          password,
          version,
          createdAt,
          updatedAt,
          budgetId,
        },
      } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(id)).toBeTruthy();
      expect(typeof email).toBe('string');
      expect(typeof username).toBe('string');
      expect(password).toBeFalsy();
      expect(typeof version).toBe('number');
      expect(typeof createdAt).toBe('string');
      expect(typeof updatedAt).toBe('string');
      expect(budgetId).toBeNull();
    });

    it('should respond with 400 status code if invalid uuid', async () => {
      const invalidUUID = 'invalid_id';
      const response = await request
        .get(userRoutes.get(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const response = await request.get(userRoutes.get(userId));

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId don`t match the token payload', async () => {
      const id = randomUUID();

      const response = await request
        .get(userRoutes.get(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with 404 status code if the user don`t exist', async () => {
      const removeResponse = await deleteTestUser({
        request,
        userId,
        cookies,
      });
      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .get(userRoutes.get(userId))
        .set('Cookie', cookies);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /user/:id', () => {
    beforeAll(async () => {
      const { user, cookies: authCookies } = await getUserAndCookies({
        request,
        signupDto,
      });
      userId = user.id;
      cookies = authCookies;
    });

    it('should update user data coorectly', async () => {
      const updateUserDto = {
        oldPassword: signupDto.password,
        newPassword: 'NewP@ssw0rd',
      };

      const response = await request
        .patch(userRoutes.update(userId))
        .send(updateUserDto)
        .set('Cookie', cookies);

      const {
        body: {
          id,
          email,
          username,
          password,
          version,
          createdAt,
          updatedAt,
          budgetId,
        },
      } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(id)).toBeTruthy();
      expect(typeof email).toBe('string');
      expect(typeof username).toBe('string');
      expect(password).toBeFalsy();
      expect(typeof version).toBe('number');
      expect(typeof createdAt).toBe('string');
      expect(typeof updatedAt).toBe('string');
      expect(budgetId).toBeNull();
    });

    it('should respond with 400 status code if invalid uuid or body', async () => {
      const invalidUUID = 'invalid_id';
      const updateUserDto = {
        oldPassword: signupDto.password,
        newPassword: 'NewP@ssw0rd',
      };
      const responses = await Promise.all([
        request
          .patch(userRoutes.update(invalidUUID))
          .send(updateUserDto)
          .set('Cookie', cookies),
        request
          .patch(userRoutes.update(userId))
          .send({ oldPassword: updateUserDto.oldPassword })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.statusCode === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const updateUserDto = {
        oldPassword: signupDto.password,
        newPassword: 'NewP@ssw0rd',
      };
      const response = await request
        .get(userRoutes.update(userId))
        .send(updateUserDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId does not match the token payload or incorrect old password', async () => {
      const id = randomUUID();
      const updateUserDto = {
        oldPassword: signupDto.password,
        newPassword: 'NewP@ssw0rd',
      };

      const responses = await Promise.all([
        request
          .patch(userRoutes.update(id))
          .send(updateUserDto)
          .set('Cookie', cookies),
        request
          .patch(userRoutes.update(userId))
          .send({ ...updateUserDto, oldPassword: 'IncorrectP@ssw0rd' })
          .set('Cookie', cookies),
      ]);
      const allForbiddenRequests = responses.every(
        (response) => response.status === StatusCodes.FORBIDDEN,
      );

      expect(allForbiddenRequests).toBe(true);
    });

    it('should respond with 404 status code if the user don`t exist', async () => {
      const updateUserDto = {
        oldPassword: signupDto.password,
        newPassword: 'NewP@ssw0rd',
      };

      const removeResponse = await deleteTestUser({
        request,
        userId,
        cookies,
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .patch(userRoutes.update(userId))
        .send(updateUserDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /user/:id', () => {
    beforeAll(async () => {
      const { user, cookies: authCookies } = await getUserAndCookies({
        request,
        signupDto,
      });
      userId = user.id;
      cookies = authCookies;
    });

    it('should respond with 400 status code if invalid uuid', async () => {
      const invalidUUID = 'invalid_id';

      const response = await request
        .delete(userRoutes.delete(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const response = await request.get(userRoutes.update(userId));

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId does not match the token payload', async () => {
      const id = randomUUID();

      const response = await request
        .delete(userRoutes.delete(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should delete user correctly', async () => {
      const response = await request
        .delete(userRoutes.delete(userId))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with 404 status code if the user don`t exist', async () => {
      const response = await request
        .delete(userRoutes.delete(userId))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
