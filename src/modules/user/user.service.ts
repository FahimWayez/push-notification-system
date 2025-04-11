import { Injectable } from '@nestjs/common';
import { mockUsers } from 'src/seeder/mock-users';
import { UserEntity } from 'src/common/user.entity';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = mockUsers;

  findAll(): UserEntity[] {
    return this.users;
  }
}
