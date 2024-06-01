import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { SuperTest, Test as T } from 'supertest';
import * as requestTest from 'supertest';
import { validate } from 'uuid';
import { randomUUID } from 'crypto';

import { AppModule } from '@app/app.module';
import { setupConfig } from '@app/app.config';
import { CreateExpenseDto } from '@app/core/expense/dto/create-expense.dto';
import { UpdateExpenseDto } from '@app/core/expense/dto/update-expense.dto';

import { expenseRoutes } from '../endpoints';
import { deleteTestUser } from '../utils/delete-test-user.util';
import { deleteTestBudget } from '../utils/delete-test-budget.util';
import { getUserAndCookies } from '../utils/get-user-and-cookies.util';
import { createTestBudget } from '../utils/create-test-budget.util';

describe('Expense (e2e)', () => {
  let app: INestApplication;
  let request: SuperTest<T>;
  let budgetId: string;
  let userId: string;
  let cookies: string[];
  const signupDto = {
    username: 'user',
    email: 'expense@email.com',
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

  describe('POST /expense', () => {
    it('should correctly create expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'EDUCATION',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const response = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);

      const { body: expense } = response;

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(validate(expense.id)).toBe(true);
      expect(expense.userId).toBe(createExpenseDto.userId);
      expect(expense.budgetId).toBe(createExpenseDto.budgetId);
      expect(expense.category).toBe(createExpenseDto.category);
      expect(expense.amount).toBe(createExpenseDto.amount);
      expect(expense.date).toBe(createExpenseDto.date);
    });

    it('should respond with 400 status code if the invalid body', async () => {
      const dto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'EDUCATION',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const responses = await Promise.all([
        request
          .post(expenseRoutes.create)
          .send({ ...dto, date: 'isNotDateString' })
          .set('Cookie', cookies),
        request
          .post(expenseRoutes.create)
          .send({ userId: dto.userId })
          .set('Cookie', cookies),
        request
          .post(expenseRoutes.create)
          .send({ budgetId: budgetId })
          .set('Cookie', cookies),
        request
          .post(expenseRoutes.create)
          .send({ category: dto.category })
          .set('Cookie', cookies),
        request
          .post(expenseRoutes.create)
          .send({ amount: dto.amount })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'EDUCATION',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const response = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 403 status code if the userId don`t match the token payload', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId: randomUUID(),
        budgetId,
        category: 'EDUCATION',
        date: new Date().toISOString(),
        amount: 1000,
      };

      const response = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('GET /expense/:id', () => {
    it('should correctly get expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request
        .get(expenseRoutes.get(createdExpense.id))
        .set('Cookie', cookies);
      const { body: expense } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(validate(expense.id)).toBe(true);
      expect(expense.userId).toBe(createdExpense.userId);
      expect(expense.budgetId).toBe(createdExpense.budgetId);
      expect(expense.category).toBe(createdExpense.category);
      expect(expense.amount).toBe(createdExpense.amount);
      expect(expense.date).toBe(createdExpense.date);
    });

    it('should respond with 400 status code if the invalid UUID', async () => {
      const invalidUUID = 'invalid_uuid';

      const response = await request
        .get(expenseRoutes.get(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request.get(expenseRoutes.get(createdExpense.id));

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the expense not found', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(expenseRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .get(expenseRoutes.get(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /expense/:id', () => {
    it('should correctly update expense', async () => {
      const createDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const updateDto: UpdateExpenseDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'EDUCATION',
        description: 'description',
      };

      const response = await request
        .patch(expenseRoutes.update(createdExpense.id))
        .send(updateDto)
        .set('Cookie', cookies);

      const { body: updatedExpense } = response;

      expect(response.status).toBe(StatusCodes.OK);
      expect(updatedExpense.id).toBe(createdExpense.id);
      expect(updatedExpense.userId).toBe(createdExpense.userId);
      expect(updatedExpense.budgetId).toBe(createdExpense.budgetId);
      expect(updatedExpense.category).toBe(updateDto.category);
      expect(updatedExpense.amount).toBe(updateDto.amount);
      expect(updatedExpense.date).toBe(updateDto.date);
    });

    it('should respond with 400 status code if the invalid UUID or invalid body', async () => {
      const createDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const invalidUUID = 'invalid_uuid';
      const updateDto: UpdateExpenseDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'EDUCATION',
        description: 'description',
      };

      const responses = await Promise.all([
        request
          .patch(expenseRoutes.update(invalidUUID))
          .send(updateDto)
          .set('Cookie', cookies),
        request
          .patch(expenseRoutes.update(createdExpense.id))
          .send({ ...updateDto, date: 'isNotDateString' })
          .set('Cookie', cookies),
        request
          .patch(expenseRoutes.update(createdExpense.id))
          .send({ ...updateDto, amount: 'string' })
          .set('Cookie', cookies),
        request
          .patch(expenseRoutes.update(createdExpense.id))
          .send({ ...updateDto, category: 'unknow' })
          .set('Cookie', cookies),
        request
          .patch(expenseRoutes.update(createdExpense.id))
          .send({ ...updateDto, description: 11111 })
          .set('Cookie', cookies),
      ]);

      const allBadRequests = responses.every(
        (response) => response.status === StatusCodes.BAD_REQUEST,
      );

      expect(allBadRequests).toBe(true);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const updateDto: UpdateExpenseDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'EDUCATION',
        description: 'description',
      };

      const response = await request
        .patch(expenseRoutes.update(createdExpense.id))
        .send(updateDto);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the expense not found', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(expenseRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const updateDto: UpdateExpenseDto = {
        date: new Date().toISOString(),
        amount: 777,
        category: 'EDUCATION',
        description: 'description',
      };

      const response = await request
        .patch(expenseRoutes.update(id))
        .send(updateDto)
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /expense/:id', () => {
    it('should correctly delete expense', async () => {
      const createDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request
        .delete(expenseRoutes.delete(createdExpense.id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with 400 status code if the invalid UUID', async () => {
      const invalidUUID = 'invalid_uuid';

      const response = await request
        .delete(expenseRoutes.delete(invalidUUID))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 401 status code if don`t have auth cookies', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 1000,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);
      const { body: createdExpense } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const response = await request.delete(
        expenseRoutes.delete(createdExpense.id),
      );

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with 404 status code if the expense not found', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId,
        budgetId,
        category: 'PERSONAL',
        amount: 777,
        date: new Date().toISOString(),
      };

      const createResponse = await request
        .post(expenseRoutes.create)
        .send(createExpenseDto)
        .set('Cookie', cookies);

      const {
        body: { id },
      } = createResponse;

      expect(createResponse.status).toBe(StatusCodes.CREATED);

      const removeResponse = await request
        .delete(expenseRoutes.delete(id))
        .set('Cookie', cookies);

      expect(removeResponse.status).toBe(StatusCodes.NO_CONTENT);

      const response = await request
        .delete(expenseRoutes.delete(id))
        .set('Cookie', cookies);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
