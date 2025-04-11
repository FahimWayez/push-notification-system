import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from './push.service';
import { PushNotificationDto } from './push.dto';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send-now')
  sendNow(@Body() payload: PushNotificationDto) {
    return this.pushService.sendNow(payload);
  }

  @Post('schedule')
  schedule(@Body() payload: PushNotificationDto) {
    return this.pushService.schedule(payload);
  }
}
