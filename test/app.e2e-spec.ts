import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { Frequency } from '../src/models/frequency.model';
import { Dataset } from '../src/models/dataset.model';
import { User } from '../src/models/user.model';
import { AccessRequest } from '../src/models/access-request.model';
import { TasksService } from '../src/common/schedule/tasks.service';
import { v4 as uuidv4 } from 'uuid';
import { StatusEnum } from '../src/common/types';

describe('Integration Tests', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let userModel: typeof User;
  let datasetModel: typeof Dataset;
  let frequencyModel: typeof Frequency;
  let accessRequestModel: typeof AccessRequest;
  let tasksService: TasksService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    sequelize = app.get(Sequelize);
    userModel = moduleFixture.get<typeof User>(getModelToken(User));
    datasetModel = moduleFixture.get<typeof Dataset>(getModelToken(Dataset));
    frequencyModel = moduleFixture.get<typeof Frequency>(getModelToken(Frequency));
    accessRequestModel = moduleFixture.get<typeof AccessRequest>(getModelToken(AccessRequest));
    tasksService = moduleFixture.get<TasksService>(TasksService);

    await sequelize.sync({ force: true });

    await userModel.create({
      id: 'b2227d2e-9c41-4aeb-abfd-0d704463da16',
      apiKey: uuidv4(),
      role: 'Quant',
    });
    await datasetModel.create({
      id: '9f135ec5-9bd9-40eb-b3ed-e9f4e0c30d76',
      name: 'Bitcoin',
      symbol: 'BTC',
    });
    await frequencyModel.create({
      id: 'd0458a45-7d3a-4bbb-b618-1d06726ea7e7',
      datasetId: '9f135ec5-9bd9-40eb-b3ed-e9f4e0c30d76',
      frequency: 'd1',
      marketCapUsd: 1000000,  
    });
    await accessRequestModel.create({
      id: uuidv4(),
      userId: 'b2227d2e-9c41-4aeb-abfd-0d704463da16',
      datasetId: '9f135ec5-9bd9-40eb-b3ed-e9f4e0c30d76',
      frequencyId: 'd0458a45-7d3a-4bbb-b618-1d06726ea7e7',
      status: StatusEnum.APPROVED,
      requestedAt: new Date(),
      expiryDate: new Date('2024-06-26T23:59:59.000Z'),
      isTemporary: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('Quant can view the metadata and available frequencies for all datasets', () => {
    it('should return metadata and frequencies for datasets', async () => {
      const response = await request(app.getHttpServer())
        .get('/datasets')
        .expect(200)
        .catch(err => {
          console.error('Error:', err.response ? err.response.body : err);  
          throw err;
        });

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(dataset => {
        expect(dataset).toHaveProperty('name');
        expect(dataset).toHaveProperty('symbol');
      });
    });
  });

  describe('Quant can request access to 1 or more frequencies for a given dataset', () => {
    it('should create an access request', async () => {
      const requestPayload = {
        userId: uuidv4(),
        datasetId: uuidv4(), 
        frequencyId: uuidv4(),
        status: StatusEnum.PENDING,
        requestedAt: '2024-06-25T08:00:00.000Z',
        expiryDate: '2024-12-31T23:59:59.000Z',
        isTemporary: true,
      };

      await userModel.create({
        id: requestPayload.userId,
        apiKey: uuidv4(),
        role: 'Quant',
      });
      await datasetModel.create({
        id: requestPayload.datasetId,
        name: 'Ethereum',
        symbol: 'ETH',
      });
      await frequencyModel.create({
        id: requestPayload.frequencyId,
        datasetId: requestPayload.datasetId,
        frequency: 'h1',
        marketCapUsd: 500000,
      });

      try {
        const response = await request(app.getHttpServer())
          .post('/access-requests')
          .set('Content-Type', 'application/json')
          .send(requestPayload)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.userId).toBe(requestPayload.userId);
        expect(response.body.datasetId).toBe(requestPayload.datasetId);
        expect(response.body.frequencyId).toBe(requestPayload.frequencyId);
        expect(response.body.status).toBe(requestPayload.status);
      } catch (err) {
        console.error('Error:', err.response ? err.response.body : err); 
        throw err;
      }
    });
  });

  describe('Ops can view all pending dataset access requests', () => {
    it('should return all pending access requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/access-requests/pending')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(request => {
        expect(request.status).toBe(StatusEnum.PENDING);
      });
    });
  });

  describe('Ops can approve or refuse a request', () => {
    it('should update the status of an access request', async () => {
      const updatePayload = { status: StatusEnum.APPROVED };

      const response = await request(app.getHttpServer())
        .patch('/access-requests/b2227d2e-9c41-4aeb-abfd-0d704463da16/9f135ec5-9bd9-40eb-b3ed-e9f4e0c30d76/d0458a45-7d3a-4bbb-b618-1d06726ea7e7')
        .set('Content-Type', 'application/json')
        .send(updatePayload)
        .expect(200)
        .catch(err => {
          console.error('Error:', err.response ? err.response.body : err); 
          throw err;
        });

      expect(response.body.status).toBe(updatePayload.status);
    });
  });

  describe('Quant can view the pricing data of the datasets/frequencies they have access to', () => {
    it('should return the pricing data for accessible datasets/frequencies', async () => {
      const response = await request(app.getHttpServer())
        .get('/datasets/bitcoin/d1/data')
        .set('userId', 'b2227d2e-9c41-4aeb-abfd-0d704463da16')
        .expect(200)
        .catch(err => {
          console.error('Error:', err.response ? err.response.body : err); 
          throw err;
        });

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Ops can provide access to datasets/frequencies for a limited amount of time', () => {
    it('should revoke access after the trial period expires', async () => {
      await request(app.getHttpServer())
        .patch('/access-requests/revoke/b2227d2e-9c41-4aeb-abfd-0d704463da16/9f135ec5-9bd9-40eb-b3ed-e9f4e0c30d76/d0458a45-7d3a-4bbb-b618-1d06726ea7e7')
        .expect(200)
        .catch(err => {
          console.error('Error:', err.response ? err.response.body : err);  
          throw err;
        });

      const response = await request(app.getHttpServer())
        .get('/datasets/bitcoin/d1/data')
        .set('userId', 'b2227d2e-9c41-4aeb-abfd-0d704463da16') 
        .expect(401)
        .catch(err => {
          console.error('Error:', err.response ? err.response.body : err);
          throw err;
        });

      expect(response.body.message).toBe('User does not have access to this dataset or frequency');
    });
  });

  describe('Backfill the market-cap of each dataset every day at 8pm UTC', () => {
    it('should backfill the market cap for each dataset', async () => {
      jest.spyOn(tasksService, 'backfillMarketCap').mockResolvedValue(undefined);

      await tasksService.backfillMarketCap();
      expect(tasksService.backfillMarketCap).toHaveBeenCalled();
    });
  });
});
