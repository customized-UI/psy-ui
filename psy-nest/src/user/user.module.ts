import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Groups } from './entities/groups.entity';
import { Histories } from './entities/history.eneity';
import { OtherHistories } from './entities/otherhistory.eneity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Groups, Histories, OtherHistories]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
