import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { SuperTest, Test as T } from 'supertest';
import * as requestTest from 'supertest';
import { validate } from 'uuid';
import { randomUUID } from 'crypto';

import { AppModule } from '@app/app.module';
import { setupConfig } from '@app/app.config';
import { CreateIncomeDto } from '@app/core/income/dto/create-income.dto';
import { UpdateIncomeDto } from '@app/core/income/dto/update-income.dto';

import { incomeRoutes } from '../endpoints';
import { deleteTestUser } from '../utils/delete-test-user.util';
import { deleteTestBudget } from '../utils/delete-test-budget.util';
import { getUserAndCookies } from '../utils/get-user-and-cookies.util';
import { createTestBudget } from '../utils/create-test-budget.util';

describe('Income (e2e)', () => {
  let app: INestApplication;
  let request: SuperTest<T>;
  let budgetId: string;
  let userId: string;
  let cookies: string[];
  const signupDto = {
    username: 'user',
    email: 'income@email.com',
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

    const { user, cookies: authCookies } = await getUserAndCookies({
      request,
      signupDto,
    });
    userId = user.id;
    cookies = authCookies;

    const budget = await createTestBudget({ request, userId, cookies });
    budgetId = budget.id;
  });

  afterAll(async () => {
    if (budgetId) {
      await deleteTestBudget({ request, budgetId, cookies });
    }

    if (userId && cookies) {
      await deleteTestUser({ request, userId, cookies });
    }

    await app.close();
  });

  describe('POST /income', () => {
    it('should correctly create Income', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const response = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);

      const { body: Income } = response;

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(validate(Income.id)).toBe(true);
      expect(Income.userId).toBe(createIncomeDto.userId);
      expect(Income.budgetId).toBe(createIncomeDto.budgetId);
      expect(Income.category).toBe(createIncomeDto.category);
      expect(Income.amount).toBe(createIncomeDto.amount);
      expect(Income.date).toBe(createIncomeDto.date);
    });

    it('should respond with 400 status code if the invalid body', async () => {
      const dto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const responses = await Promise.all([
        request
          .post(incomeRoutes.create)
          .send({ ...dto, date: 'isNotDateString' })
          .set('Cookie', cookies),
        request
          .post(incomeRoutes.create)
          .send({ userId: dto.userId })
          .set('Cookie', cookies),
        request
          .post(incomeRoutes.create)
          .send({ budgetId: budgetId })
          .set('Cookie', cookies),
        request
          .post(incomeRoutes.create)
          .send({ category: dto.category })
          .set('Cookie', cookies),
        request
          .post(incomeRoutes.create)
          .send({ amount: dto.amount })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const response = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId don`t match the token payload', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId: randomUUID(),
        budgetId,
        category: 'FREELANCE',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const response = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('GET /income/:id', () => {
    it('should correctly get Income', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request
        .get(incomeRoutes.get(createdIncome.id))
        .set('Cookie', cookies);
      const { body: Income } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(Income.id)).toBe(true);
      expect(Income.userId).toBe(createdIncome.userId);
      expect(Income.budgetId).toBe(createdIncome.budgetId);
      expect(Income.category).toBe(createdIncome.category);
      expect(Income.amount).toBe(createdIncome.amount);
      expect(Income.date).toBe(createdIncome.date);
    });

    it('should respond with 400 status code if the invalid UUID', async () => {
      const invalidUUID = 'invalid_uuid';

      const response = await request
        .get(incomeRoutes.get(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request.get(incomeRoutes.get(createdIncome.id));

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the Income not found', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(incomeRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .get(incomeRoutes.get(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /income/:id', () => {
    it('should correctly update Income', async () => {
      const createDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const updateDto: UpdateIncomeDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'FREELANCE',
        description: 'description',
      };

      const response = await request
        .patch(incomeRoutes.update(createdIncome.id))
        .send(updateDto)
        .set('Cookie', cookies);

      const { body: updatedIncome } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(updatedIncome.id).toBe(createdIncome.id);
      expect(updatedIncome.userId).toBe(createdIncome.userId);
      expect(updatedIncome.budgetId).toBe(createdIncome.budgetId);
      expect(updatedIncome.category).toBe(updateDto.category);
      expect(updatedIncome.amount).toBe(updateDto.amount);
      expect(updatedIncome.date).toBe(updateDto.date);
    });

    it('should respond with 400 status code if the invalid UUID or invalid body', async () => {
      const createDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const invalidUUID = 'invalid_uuid';
      const updateDto: UpdateIncomeDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'FREELANCE',
        description: 'description',
      };

      const responses = await Promise.all([
        request
          .patch(incomeRoutes.update(invalidUUID))
          .send(updateDto)
          .set('Cookie', cookies),
        request
          .patch(incomeRoutes.update(createdIncome.id))
          .send({ ...updateDto, date: 'isNotDateString' })
          .set('Cookie', cookies),
        request
          .patch(incomeRoutes.update(createdIncome.id))
          .send({ ...updateDto, amount: 'string' })
          .set('Cookie', cookies),
        request
          .patch(incomeRoutes.update(createdIncome.id))
          .send({ ...updateDto, category: 'invalid_' })
          .set('Cookie', cookies),
        request
          .patch(incomeRoutes.update(createdIncome.id))
          .send({ ...updateDto, description: 11111 })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const updateDto: UpdateIncomeDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'FREELANCE',
        description: 'description',
      };

      const response = await request
        .patch(incomeRoutes.update(createdIncome.id))
        .send(updateDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the Income not found', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(incomeRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const updateDto: UpdateIncomeDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'FREELANCE',
        description: 'description',
      };

      const response = await request
        .patch(incomeRoutes.update(id))
        .send(updateDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /income/:id', () => {
    it('should correctly delete Income', async () => {
      const createDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request
        .delete(incomeRoutes.delete(createdIncome.id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with 400 status code if the invalid UUID', async () => {
      const invalidUUID = 'invalid_uuid';

      const response = await request
        .delete(incomeRoutes.delete(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);
      const { body: createdIncome } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request.delete(
        incomeRoutes.delete(createdIncome.id),
      );

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the Income not found', async () => {
      const createIncomeDto: CreateIncomeDto = {
        userId,
        budgetId,
        category: 'FREELANCE',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(incomeRoutes.create)
        .send(createIncomeDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(incomeRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .delete(incomeRoutes.delete(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
