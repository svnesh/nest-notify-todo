import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: 'notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
  }
  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }
}
