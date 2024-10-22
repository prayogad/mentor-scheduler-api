import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie-signature';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('TEST'));
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('User Register POST /user/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to register user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'pass1234',
          name: 'test',
          phone: '12345678',
          role: 'mentor',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully create user');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('User Login POST /user/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createMentor();
    });

    it('should be able to login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'pass1234',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully login user');
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'pass12345',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('email or password wrong');
      expect(response.body.data).toBeUndefined();
    });
  });

  describe('Get Current User GET /user/api/current', () => {
    let mentor;
    beforeEach(async () => {
      await testService.deleteAll();
      mentor = await testService.createMentor();
    });

    it('should be able to get current user data', async () => {
      const signedCookie = 's:' + cookie.sign(mentor.token, 'TEST');
      const response = await request(app.getHttpServer())
        .get('/user/api/current')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully get user');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.phone).toBe('12345678');
      expect(response.body.data.role).toBe('mentor');
    });

    it('should be reject if cookie is invalid', async () => {
      const signedCookie = 's:' + cookie.sign('wrongToken', 'TEST');
      const response = await request(app.getHttpServer())
        .get('/user/api/current')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorize');
      expect(response.body.data).toBeUndefined();
    });
  });

  describe('Update User PUT /user/api/update', () => {
    let mentor;
    beforeEach(async () => {
      await testService.deleteAll();
      mentor = await testService.createMentor();
    });

    afterEach(async () => {
      await testService.deleteUpdatedUser();
    });

    it('should be able to update user info', async () => {
      const signedCookie = 's:' + cookie.sign(mentor.token, 'TEST');
      const response = await request(app.getHttpServer())
        .put('/user/api/update')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token)
        .send({
          email: 'newTest@example.com',
          name: 'newTest',
          phone: '9101112',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully update user');
      expect(response.body.data.email).toBe('newTest@example.com');
      expect(response.body.data.name).toBe('newTest');
      expect(response.body.data.phone).toBe('9101112');
    });

    it('should be able to update password user', async () => {
      const signedCookie = 's:' + cookie.sign(mentor.token, 'TEST');
      let response = await request(app.getHttpServer())
        .put('/user/api/update')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token)
        .send({
          password: 'newPass1234',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully update user');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.phone).toBe('12345678');

      response = await request(app.getHttpServer()).post('/user/login').send({
        email: 'test@example.com',
        password: 'newPass1234',
      });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully login user');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Get User Dashboard GET /user/api/dashboard', () => {
    let mentor;
    let student;
    beforeEach(async () => {
      await testService.deleteAll();
      mentor = await testService.createMentor();
      student = await testService.createUser();
      await testService.createSesion();
      await testService.createBookedSession(student.id);
    });

    it('should be able to get user dashboard', async () => {
      const signedCookie = 's:' + cookie.sign(mentor.token, 'TEST');
      const response = await request(app.getHttpServer())
        .get('/user/api/dashboard')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully get user dashboard');
      expect(response.body.data[0].mentor_name).toBe('test');
      expect(response.body.data[0].student_name).toBe('student');
      expect(response.body.data[0].field).toBe('Web Development');
      expect(response.body.data[0].scheduledAt).toBeDefined();
    });

    it('should be reject if cookie is invalid', async () => {
      const signedCookie = 's:' + cookie.sign('wrong', 'TEST');
      const response = await request(app.getHttpServer())
        .get('/user/api/dashboard')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorize');
      expect(response.body.data).toBeUndefined();
    });
  });

  describe('Logout User POST /user/api/logout', () => {
    let mentor;
    beforeEach(async () => {
      await testService.deleteAll();
      mentor = await testService.createMentor();
    });

    it('should be able to logout data', async () => {
      const signedCookie = 's:' + cookie.sign(mentor.token, 'TEST');
      const response = await request(app.getHttpServer())
        .post('/user/api/logout')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('successfully logout user');
    });

    it('should be reject if cookie is invalid', async () => {
      const signedCookie = 's:' + cookie.sign('wrong', 'TEST');
      const response = await request(app.getHttpServer())
        .post('/user/api/logout')
        .set('Cookie', [`refreshToken=${signedCookie}`])
        .set('Authorization', mentor.access_token);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorize');
      expect(response.body.data).toBeUndefined();
    });
  });
});
