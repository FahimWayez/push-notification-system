import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PushNotificationDto } from './push.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PushService {
  constructor(
    @InjectQueue('pushQueue') private readonly pushQueue: Queue,
    private readonly userService: UserService,
  ) {}

  async sendNow(payload: PushNotificationDto) {
    const users = this.userService.findAll();

    users.forEach((user) => {
      console.log(
        `[IMMEDIATE] Pushing to ${user.name} (${user.deviceToken}): ` +
          `"${payload.title}" - ${payload.message}`,
      );
    });

    return { status: 'ok', message: 'Push sent immediately to all users' };
  }

  async schedule(payload: PushNotificationDto) {
    if (!payload.scheduleAt) {
      return this.sendNow(payload);
    }

    const scheduleDate = new Date(payload.scheduleAt);
    const now = Date.now();
    const diff = scheduleDate.getTime() - now;

    if (isNaN(scheduleDate.getTime())) {
      throw new BadRequestException('Invalid scheduleAt date.');
    }

    if (diff <= 0) {
      return this.sendNow(payload);
    }

    const job = await this.pushQueue.add(
      'scheduled-push',
      {
        ...payload,
      },
      {
        delay: diff,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    // console.log(`[JOB QUEUED] Job ID: ${job.id}, Scheduled in: ${diff}ms`);
    return {
      status: 'scheduled',
      message: `Push notification scheduled at ${scheduleDate.toISOString()}.`,
    };
  }
}
