export class CreateNotificationDto {
  entityId: number;
  toUserId: number;
  entityType: string;
  ownerId: number;
  metaInfo?: Record<string, any>;
}
