import { IsString, IsOptional, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PushNotificationDto {
  @ApiProperty({ example: 'Promo Alert' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Get 20% OFF!' })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    example: '2025-04-11T20:53:00.000Z',
    description: 'ISO timestamp (UTC) for scheduling',
  })
  @IsOptional()
  @IsISO8601()
  scheduleAt?: string;
}
