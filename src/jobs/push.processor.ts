import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from 'src/modules/user/user.service';

@Processor('pushQueue')
export class PushProcessor {
  constructor(private readonly userService: UserService) {
    // console.log('[PushProcessor] Initialized');
  }

  @Process('scheduled-push')
  async handleScheduledPush(job: Job) {
    // console.log('[TRIGGERED]', job.data);
    // console.log('[PROCESSOR] Job received in push processor:', job.id);
    const { title, message } = job.data;
    const users = this.userService.findAll();

    users.forEach((user) => {
      console.log(
        `[SCHEDULED] Pushing to ${user.name} (${user.deviceToken}): ` +
          `"${title}" - ${message}`,
      );
    });

    return true;
  }
}
