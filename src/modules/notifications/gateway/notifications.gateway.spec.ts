import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsGateway } from './notifications.gateway';
import { Server, Socket } from 'socket.io';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsGateway],
    }).compile();

    gateway = module.get<NotificationsGateway>(NotificationsGateway);

    server = new Server();
    gateway.server = server;
    jest.spyOn(gateway['logger'], 'log').mockImplementation(jest.fn());

    jest.spyOn(server, 'emit').mockImplementation(jest.fn());
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('afterInit', () => {
    it('should log initialization', () => {
      gateway.afterInit(server);
      expect(gateway['logger'].log).toHaveBeenCalledWith('Init');
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const client = { id: 'client-id' } as Socket;
      gateway.handleDisconnect(client);
      expect(gateway['logger'].log).toHaveBeenCalledWith(`Client disconnected: ${client.id}`);
    });
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const client = { id: 'client-id' } as Socket;
      gateway.handleConnection(client);
      expect(gateway['logger'].log).toHaveBeenCalledWith(`Client connected: ${client.id}`);
    });
  });

  describe('handleMessage', () => {
    it('should log and emit message from client', () => {
      const client = { id: 'client-id' } as Socket;
      const payload = { data: 'test message' };
      gateway.handleMessage(client, payload);
      expect(gateway['logger'].log).toHaveBeenCalledWith(`Message from client ${client.id}: ${payload}`);
      expect(server.emit).toHaveBeenCalledWith('messageToClient', payload);
    });
  });

  describe('sendNotification', () => {
    it('should log and emit notification', () => {
      const notification = { message: 'test notification' };
      gateway.sendNotification(notification);
      expect(gateway['logger'].log).toHaveBeenCalledWith('Sending notification:', notification);
      expect(server.emit).toHaveBeenCalledWith('notification', notification);
    });
  });
});
