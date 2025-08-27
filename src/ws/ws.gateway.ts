/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/', // root namespace
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private jwt: JwtService) {}

  // ✅ When client connects
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query?.token as string;
      if (!token) return client.disconnect();

      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // store userId in client
      (client.data as any).userId = payload.sub;

      // ✅ each user apne personal notification room join karega
      client.join(`user:${payload.sub}`);

      console.log(`✅ User ${payload.sub} connected to socket`);
    } catch (e) {
      console.log('❌ Invalid token in socket connection');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`⚠️ User ${client.data?.userId} disconnected`);
  }

  // ✅ Client specific post room join karega
  @SubscribeMessage('joinPost')
  onJoinPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    if (data?.postId) {
      client.join(`post:${data.postId}`);
      console.log(`📌 User ${client.data?.userId} joined post:${data.postId}`);
    }
  }

  // ------------------------------
  // Helpers for services/controllers
  // ------------------------------

  // Send event to one specific user
  emitToUserId(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  // Send event to all users in a post room
  emitToPost(postId: string, event: string, payload: any) {
    this.server.to(`post:${postId}`).emit(event, payload);
  }

  // Send event to everyone
  emitGlobal(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
