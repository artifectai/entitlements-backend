import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([
        { id: 1, api_key: 'api_key_1', role: 'admin', created_at: expect.any(String) }
      ]);
  });

  it('/users/generate-token (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/generate-token')
      .send({ api_key: 'test_api_key' })
      .expect(201)
      .expect('test_token');
  });

  it('/users/validate (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/validate')
      .set('Authorization', 'Bearer test_token')
      .expect(200)
      .expect({ id: 1, api_key: 'api_key_1', role: 'admin', created_at: expect.any(String) });
  });

  afterAll(async () => {
    await app.close();
  });
});
