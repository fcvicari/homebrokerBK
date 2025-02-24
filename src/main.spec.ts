import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('Bootstrap (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Applying ValidationPipe
    app.useGlobalPipes(new ValidationPipe());

    // Configuring Swagger
    const config = new DocumentBuilder()
      .setTitle('Home Broker API example')
      .setDescription('The Home Broker API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger/api', app, document);

    await app.init();
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 on Swagger UI', async () => {
    const res = await request(app.getHttpServer()).get('/swagger/api');
    expect(res.status).toBe(200);
  });

  it('should apply ValidationPipe globally', async () => {
    const res = await request(app.getHttpServer())
      .post('/some-endpoint')
      .send({ invalidField: 'invalid' });

    expect(res.status).toBe(404);
  });

  it('should bootstrap the application', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    expect(app).toBeDefined();

    await app.close();
  });
});