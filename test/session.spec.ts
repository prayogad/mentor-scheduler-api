import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
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
      await testService.deleteAll()
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
    });

    it('should be rejeected if quota less than 1', async () => {
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
    });

    it('should be rejected if the user is not a mentor', async () => {
      await testService.deleteUser()
      await testService.createUser()
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .post('/session/api/addSession')
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2030-10-03T14:30:00Z",
          quota: 5
        });

      logger.info(response.body)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("mentor not found")
      expect(response.body.data).toBeUndefined()
    })
  });

  describe('Update Mentor Session PUT /session/api/updateSesion/:sessionId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createMentor()
      await testService.createSesion()
    })

    it('should be able to update mentor session', async () => {
      const session = await testService.getSesion();
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .put(`/session/api/updateSession/${session.id}`)
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2030-12-23T10:30:00Z",
          quota: 10
        });

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully update mentor session")
      expect(response.body.data.scheduledAt).toBe("2030-12-23T10:30:00.000Z")
      expect(response.body.data.quota).toBe(10)
    });
    
    it('should be rejected if session not found', async () => {
      const session = await testService.getSesion();
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .put(`/session/api/updateSession/${session.id + 1}`)
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          scheduledAt: "2030-12-23T10:30:00Z",
          quota: 10
        });

      logger.info(response.body)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("session is not found")
      expect(response.body.data).toBeUndefined()
    });
  });

  describe('Delete Mentor Session DELETE /session/api/deleteSesion/:sessionId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createMentor()
      await testService.createSesion()
    })

    it('should be able to delete mentor session', async () => {
      const session = await testService.getSesion();
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .delete(`/session/api/deleteSession/${session.id}`)
        .set('Cookie', [`auth=${signedCookie}`])

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully delete mentor session")
    });
    
    it('should be rejected and unauthorized if cookie invalid', async () => {
      const session = await testService.getSesion();
      const signedCookie = 's:' + cookie.sign("wrong", "TEST");
      const response = await request(app.getHttpServer())
        .delete(`/session/api/deleteSession/${session.id}`)
        .set('Cookie', [`auth=${signedCookie}`])

      logger.info(response.body)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Unauthorize")
    });
    
    it('should be rejected if session not found', async () => {
      const session = await testService.getSesion();
      const signedCookie = 's:' + cookie.sign("test", "TEST");
      const response = await request(app.getHttpServer())
        .delete(`/session/api/deleteSession/${session.id + 1}`)
        .set('Cookie', [`auth=${signedCookie}`])

      logger.info(response.body)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("session is not found")
    });
  });
  
  describe('Get Mentor Sessions GET /session/api/getSesion', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createMentor()
      await testService.createSesion()
    })

    it('should be able to get mentor sessions', async () => {
      const mentor = await testService.getMentor()
      const response = await request(app.getHttpServer())
        .get(`/session/getSession/${mentor.id}`)

      logger.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully get mentor sessions")
      expect(response.body.data).toBeDefined()
    });
  });

  describe('Book Mentoring Session POST /session/api/student/bookSession/:mentorId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createMentor()
      await testService.createSesion()
    })

    it('should be able to book mentoring session', async () => {
      const session = await testService.getSesion();
      const mentor = await testService.getMentor();
      const signedCookie = 's:' + cookie.sign("student", "TEST");
      const response = await request(app.getHttpServer())
        .post(`/session/api/student/bookSession/${mentor.id}`)
        .set('Cookie', [`auth=${signedCookie}`])
        .send({
          session_id: session.id
        });

      logger.info(response.body)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("successfully book mentoring session")
      expect(response.body.data.scheduledAt).toBe("2030-10-03T14:30:00.000Z")
      expect(response.body.data.mentor_name).toBe("test")
      expect(response.body.data.student_name).toBe("student")
      expect(response.body.data.bookedAt).toBeDefined()
    });
  });
});
