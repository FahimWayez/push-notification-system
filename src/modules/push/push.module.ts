import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { PushProcessor } from 'src/jobs/push.processor';
import { UserModule } from '../user/user.module';
import { Queue } from 'bull';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'pushQueue',
    }),
  ],
  controllers: [PushController],
  providers: [PushService, PushProcessor],
})
export class PushModule {
  constructor(@InjectQueue('pushQueue') private readonly pushQueue: Queue) {
    this.pushQueue.on('completed', (job) => {
      // console.log(`[JOB COMPLETED] ID: ${job.id}`);
    });

    this.pushQueue.on('failed', (job, err) => {
      console.error(`[JOB FAILED] ID: ${job.id}`, err);
    });
  }
}
