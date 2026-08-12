import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

jest.setTimeout(30000);

describe('AbleSpace API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /api/auth/guest - Should authenticate guest user and return JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/guest')
      .send({ name: 'Guest User' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.isGuest).toBe(true);
  });

  it('GET /api/tasks - Should list tasks', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/tasks')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/projects - Should list projects', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/projects')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/labels - Should list labels', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/labels')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
