import { SuperTest, Test } from 'supertest';
import { authRoutes, userRoutes } from '../endpoints';

export interface IArgs {
  request: SuperTest<Test>;
  userId: string;
  loginDto?: {
    email: string;
    password: string;
  };
  cookies?: string[];
}

export const deleteTestUser = async (args: IArgs) => {
  const { request, userId, loginDto } = args;
  let { cookies } = args;

  if (!cookies) {
    const loginResponse = await request
      .post(authRoutes.login)
      .send(loginDto)
      .expect(201);

    cookies = loginResponse.get('Set-Cookie');
  }

  return await request.delete(userRoutes.delete(userId)).set('Cookie', cookies);
};
