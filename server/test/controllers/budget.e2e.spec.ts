import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { SuperTest, Test as T } from 'supertest';
import * as requestTest from 'supertest';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';

import { AppModule } from '@app/app.module';
import { setupConfig } from '@app/app.config';
import { UpdateBudgetDto } from '@app/core/budget/dto/update-budget.dto';
import { CreateBudgetDto } from '@app/core/budget/dto/create-budget.dto';
import { CreateDemoBudgetDto } from '@app/core/budget/dto/create-demo-budget.dto';

import { budgetRoutes } from '../endpoints';
import { deleteTestUser } from '../utils/delete-test-user.util';
import { deleteTestBudget } from '../utils/delete-test-budget.util';
import { getUserAndCookies } from '../utils/get-user-and-cookies.util';
import { createTestBudget } from '../utils/create-test-budget.util';

describe('Budget (e2e)', () => {
  let app: INestApplication;
  let request: SuperTest<T>;
  let userId: string;
  let cookies: string[];
  const signupDto = {
    username: 'user',
    email: 'budget@email.com',
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
  });

  afterAll(async () => {
    if (userId && cookies) {
      await deleteTestUser({ request, userId, cookies });
    }

    await app.close();
  });

  describe('POST /budget', () => {
    it('should correctly create budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        userId: userId,
        name: 'Test budget',
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.create)
        .send(createBudgetDto)
        .set('Cookie', cookies);

      const { body: budget } = response;

      await deleteTestBudget({ request, budgetId: budget.id, cookies });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(validate(budget.id)).toBe(true);
      expect(budget.name).toBe(createBudgetDto.name);
      expect(budget.currency).toBe(createBudgetDto.currency);
      expect(budget.goal).toBe(createBudgetDto.goal);
    });

    it('should respond with 400 status code if the invalid body', async () => {
      const dto: CreateBudgetDto = {
        userId: userId,
        name: 'Test budget',
        currency: 'EUR',
        goal: 1000,
      };

      const responses = await Promise.all([
        request
          .post(budgetRoutes.create)
          .send({ userId: dto.userId })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.create)
          .send({ name: dto.name })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.create)
          .send({ currency: dto.currency })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.create)
          .send({ goal: dto.goal })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createBudgetDto: CreateBudgetDto = {
        userId: userId,
        name: 'Test budget',
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.create)
        .send(createBudgetDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId don`t match the token payload', async () => {
      const createBudgetDto: CreateBudgetDto = {
        userId: randomUUID(),
        name: 'Test budget',
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.create)
        .send(createBudgetDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('POST /budget/demo', () => {
    it('should correctly create demo budget', async () => {
      const dto: CreateDemoBudgetDto = {
        userId: userId,
        expensesRecords: 10,
        incomeRecords: 10,
        period: 2,
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.createDemo)
        .send(dto)
        .set('Cookie', cookies);

      const { body: budget } = response;

      await deleteTestBudget({ request, budgetId: budget.id, cookies });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(validate(budget.id)).toBe(true);
      expect(budget.currency).toBe(dto.currency);
      expect(budget.goal).toBe(dto.goal);
      expect(budget.Incomes.length).toBe(dto.incomeRecords);
      expect(budget.Expenses.length).toBe(dto.expensesRecords);
    });

    it('should respond with 400 status code if the invalid body', async () => {
      const dto: CreateDemoBudgetDto = {
        userId: userId,
        expensesRecords: 10,
        incomeRecords: 100,
        period: 2,
        currency: 'EUR',
        goal: 1000,
      };

      const responses = await Promise.all([
        request
          .post(budgetRoutes.createDemo)
          .send({ userId: dto.userId })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.createDemo)
          .send({ name: dto.period })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.createDemo)
          .send({ currency: dto.currency })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.createDemo)
          .send({ goal: dto.goal })
          .set('Cookie', cookies),
        request
          .post(budgetRoutes.createDemo)
          .send({ ...dto, goal: 'string' })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createBudgetDto: CreateDemoBudgetDto = {
        userId: userId,
        expensesRecords: 10,
        incomeRecords: 100,
        period: 2,
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.createDemo)
        .send(createBudgetDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId don`t match the token payload', async () => {
      const createBudgetDto: CreateDemoBudgetDto = {
        userId: randomUUID(),
        expensesRecords: 10,
        incomeRecords: 100,
        period: 2,
        currency: 'EUR',
        goal: 1000,
      };

      const response = await request
        .post(budgetRoutes.createDemo)
        .send(createBudgetDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('GET /budget/:id', () => {
    it('should correctly get budget', async () => {
      const testBudget = await createTestBudget({ request, userId, cookies });

      const response = await request
        .get(budgetRoutes.get(testBudget.id))
        .set('Cookie', cookies);

      const { body: budget } = response;

      await deleteTestBudget({ request, budgetId: budget.id, cookies });

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(budget.id)).toBe(true);
      expect(budget.currency).toBe(testBudget.currency);
      expect(budget.goal).toBe(testBudget.goal);
      expect(budget.name).toBe(testBudget.name);
    });

    it('should respond with 400 status code if the invalid uuid', async () => {
      const invalidUUID = 'invalid_uuid';
      const response = await request
        .get(budgetRoutes.get(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const response = await request.get(budgetRoutes.get(id));

      await deleteTestBudget({ request, budgetId: id, cookies });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with a 404 status code if the budget not found', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const removeResponse = await deleteTestBudget({
        request,
        budgetId: id,
        cookies,
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .get(budgetRoutes.get(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /budget/:id', () => {
    it('should correctly update budget', async () => {
      const testBudget = await createTestBudget({ request, userId, cookies });
      const updateBudgetDto: UpdateBudgetDto = {
        name: 'New budget name',
        goal: 777,
      };

      const response = await request
        .patch(budgetRoutes.update(testBudget.id))
        .send(updateBudgetDto)
        .set('Cookie', cookies);

      const { body: budget } = response;

      await deleteTestBudget({ request, budgetId: budget.id, cookies });

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(budget.id)).toBe(true);
      expect(budget.id).toBe(testBudget.id);
      expect(budget.goal).toBe(updateBudgetDto.goal);
      expect(budget.name).toBe(updateBudgetDto.name);
    });

    it('should respond with 400 status code if the invalid uuid or body', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const invalidUUID = 'invalid_uuid';
      const validDto = {
        name: 'New budget name',
        goal: 777,
      };
      const invalidDto = {
        name: 777,
        goal: 'New budget name',
      };

      const responses = await Promise.all([
        request
          .patch(budgetRoutes.update(invalidUUID))
          .send(validDto)
          .set('Cookie', cookies),
        request
          .patch(budgetRoutes.update(id))
          .send(invalidDto)
          .set('Cookie', cookies),
      ]);
      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      await deleteTestBudget({ request, budgetId: id, cookies });

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const validDto = {
        name: 'New budget name',
        goal: 777,
      };
      const response = await request
        .patch(budgetRoutes.update(id))
        .send(validDto);

      await deleteTestBudget({ request, budgetId: id, cookies });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with a 404 status code if the budget not found', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const removeResponse = await deleteTestBudget({
        request,
        budgetId: id,
        cookies,
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .patch(budgetRoutes.update(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /budget/:id', () => {
    it('should correctly delete budget', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });

      const response = await request
        .delete(budgetRoutes.delete(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with 400 status code if the invalid uuid', async () => {
      const invalidUUID = 'invalid_uuid';

      const response = await request
        .delete(budgetRoutes.delete(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });

      const response = await request.delete(budgetRoutes.delete(id));

      await deleteTestBudget({ request, budgetId: id, cookies });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with a 404 status code if the budget not found', async () => {
      const { id } = await createTestBudget({ request, userId, cookies });
      const removeResponse = await deleteTestBudget({
        request,
        budgetId: id,
        cookies,
      });

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .delete(budgetRoutes.delete(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
