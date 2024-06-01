import { SuperTest, Test } from 'supertest';
import { budgetRoutes } from '../endpoints';

export interface IArgs {
  request: SuperTest<Test>;
  budgetId: string;
  cookies: string[];
}

export const deleteTestBudget = async (args: IArgs) => {
  const { request, budgetId, cookies } = args;

  return await request
    .delete(budgetRoutes.delete(budgetId))
    .set('Cookie', cookies)
    .expect(204);
};
