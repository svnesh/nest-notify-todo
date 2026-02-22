import { User } from 'src/generated/prisma/client';

export interface NotificationPayload {
  event: string;
  entityId: number;
  entityType: string;
  ownerId: User;
  metadata?: Record<string, any>;
  receipientIds: number[];
}
