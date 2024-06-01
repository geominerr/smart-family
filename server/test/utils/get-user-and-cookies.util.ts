import { SuperTest, Test } from 'supertest';
import { authRoutes } from '../endpoints';

interface IArgs {
  request: SuperTest<Test>;
  signupDto: {
    username: string;
    email: string;
    password: string;
  };
}

export const getUserAndCookies = async (args: IArgs) => {
  const { request, signupDto } = args;
  const { email, password } = signupDto;

  const signupResponse = await request
    .post(authRoutes.signup)
    .send(signupDto)
    .expect(201);

  const loginResponse = await request
    .post(authRoutes.login)
    .send({ email, password })
    .expect(201);

  const user = signupResponse.body;
  const cookies = loginResponse.get('Set-Cookie');

  return { user, cookies };
};
