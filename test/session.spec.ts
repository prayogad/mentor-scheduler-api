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

  describe('Add Mentor Session POST /session/api', () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createMentor()
    })

    it('should be able to add mentor session', async () => {
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .post('/session/api/addSession')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2030-10-03T14:30:00Z",
          quota: 5
        });

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully add mentor session")
      expect(response.body.data.scheduledAt).toBe("2030-10-03T14:30:00.000Z")
    })

    it('should be rejeected if quota lesser than 1', async () => {
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .post('/session/api/addSession')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2030-10-03T14:30:00Z",
          quota: 0
        });

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message[0].message).toBe("Number must be greater than or equal to 1")
      expect(response.body.data).toBeUndefined()
    });
    
    it('should be rejeected if scheduled date is in the past', async () => {
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .post('/session/api/addSession')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2024-10-03T14:30:00Z",
          quota: 5
        });

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message[0].message).toBe("scheduled time cannot in the past")
      expect(response.body.data).toBeUndefined()
    })
  });
});
