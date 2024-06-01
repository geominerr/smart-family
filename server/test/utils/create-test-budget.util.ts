import { SuperTest, Test } from 'supertest';
import { Budget } from '@app/core/budget/entities/budget.entity';
import { budgetRoutes } from '../endpoints';

const createBudgetDto = {
  userId: undefined,
  name: 'Test budget',
  currency: 'EUR',
  goal: 1000,
};

interface IArgs {
  request: SuperTest<Test>;
  userId: string;
  cookies: string[];
}

export const createTestBudget = async (args: IArgs) => {
  const { request, userId, cookies } = args;

  const response = await request
    .post(budgetRoutes.create)
    .send({ ...createBudgetDto, userId })
    .set('Cookie', cookies)
    .expect(201);

  return response.body as Budget;
};
