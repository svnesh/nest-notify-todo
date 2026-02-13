export interface NotificationPayload {
  event: string;
  entityId: number;
  entityType: string;
  ownerId: number;
  metadata?: Record<string, any>;
  receipientIds: number[];
}
