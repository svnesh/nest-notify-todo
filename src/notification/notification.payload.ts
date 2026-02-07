export interface NotificationPayload {
  entityId: number;
  entityType: string;
  ownerId: number;
  metadata?: Record<string, any>;
  receipientIds: number[];
}
