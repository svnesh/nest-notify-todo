

export class CreateNotificationDto {
  entityId: number;
  toUserId: number;
  entityType: string;
  metaInfo?: any;
}