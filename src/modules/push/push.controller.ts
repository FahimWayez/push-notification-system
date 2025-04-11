import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from './push.service';
import { PushNotificationDto } from './push.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Push Notifications')
@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send-now')
  @ApiOperation({
    summary: 'Send a push notification immediately to all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Push notification sent successfully',
  })
  @ApiBody({
    type: PushNotificationDto,
    examples: {
      basic: {
        summary: 'Example payload',
        value: {
          title: 'Immediate Promo',
          message: 'Get 15% OFF right now!',
        },
      },
    },
  })
  sendNow(@Body() payload: PushNotificationDto) {
    return this.pushService.sendNow(payload);
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule a push notification for a future time' })
  @ApiResponse({
    status: 200,
    description: 'Push notification has been scheduled',
  })
  @ApiBody({
    type: PushNotificationDto,
    examples: {
      scheduled: {
        summary: 'Schedule Example',
        value: {
          title: 'Promo Alert',
          message: 'Get 20% OFF!',
          scheduleAt: '2025-04-11T20:53:00.000Z',
        },
      },
    },
  })
  schedule(@Body() payload: PushNotificationDto) {
    return this.pushService.schedule(payload);
  }
}
