import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as cookie from "cookie-signature";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser("TEST"))
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER)
  });

  describe('Mentor Profile PUT /mentor/api/profile', () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createMentor()
    })

    it('should be able to register user', async () => {
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .put('/mentor/api/profile')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          field: "Web Development",
          bio: "I am mentor in web development field"
        });

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully update mentor profile")
      expect(response.body.data.field).toBe("Web Development")
      expect(response.body.data.bio).toBe("I am mentor in web development field")
    })
    
    it('should be able rejected if cookie invalid', async () => {
      const signedCookie = 's:' + cookie.sign("wrong", "TEST");
      const response = await request(app.getHttpServer())
        .put('/mentor/api/profile')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          field: "Web Development",
          bio: "I am mentor in web development field"
        });

      logger.info(response.body)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Unauthorize")
      expect(response.body.data).toBeUndefined()
    });
    
    it('should be able rejected if request invalid', async () => {
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .put('/mentor/api/profile')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          field: "",
          bio: ""
        });

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
      expect(response.body.data).toBeUndefined()
    });
  });

  describe('Get Mentor By Id GET /mentor/:id', () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createMentor()
    })

    it('should be able to get mentor data by id', async () => {
      const mentor = await testService.getMentor()
      const response = await request(app.getHttpServer())
        .get(`/mentor/${mentor.id}`)

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully get mentor by id")
      expect(response.body.data.email).toBe("test@example.com")
      expect(response.body.data.name).toBe("test")
      expect(response.body.data.phone).toBe("12345678")
    });

    it('should be reject if mentor invalid', async () => {
      const mentor = await testService.getMentor()
      const response = await request(app.getHttpServer())
        .get(`/mentor/${mentor.id + 1}`)

      logger.info(response.body)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("mentor not found")
      expect(response.body.data).toBeUndefined()
    });
  });
  
  describe('Get All Mentors GET /mentor', () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createMentor()
    })

    it('should be able to get all mentor data', async () => {
      const mentor = await testService.getMentor()
      const response = await request(app.getHttpServer())
        .get(`/mentor`)

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully get all mentors")
      expect(response.body.data).toBeDefined()
    });
  });
});
