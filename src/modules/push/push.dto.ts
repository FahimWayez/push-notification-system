import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class PushNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsISO8601()
  scheduleAt?: string;
}
