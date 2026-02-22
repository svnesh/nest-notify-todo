import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'ws';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: 'notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  @Inject(JwtService) private jwtService: JwtService;
  @Inject(ConfigService) private configService: ConfigService;

  private logger = new Logger('NotificationGateway');

  afterInit(server: any) {
    this.logger.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket, req: Request) {
    try {
      const token = this.extractTokenFromClient(req);
      if (!token) {
        throw new Error('No token provided');
      }
      //verifying token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.user = payload; // Attaching user info to client for later use
    } catch (error) {
      this.logger.error('Error during client connection', error);
      client.close(1008, 'Unauthorized');
      return;
    }
    console.log('Client connected');
  }

  async sendNotification(@MessageBody() payload: any) {
    const { receipientIds, ...remaining } = payload;
    const notification = this.notificationMessage(remaining);
    this.server.clients.forEach((client) => {
      if (client.user && receipientIds.includes(client.user.sub)) {
        client.send(JSON.stringify(notification));
      }
    });
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  private extractTokenFromClient(req: Request): string | null {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private notificationMessage(payload: any) {
    const { event, entityId, entityType, metadata } = payload;
    return `Event: ${event}, Entity: ${entityType} with ID ${entityId}, Owner: ${payload?.ownerId?.name || 'Unknown'},  Metadata: ${JSON.stringify(metadata)}`;
  }
}
