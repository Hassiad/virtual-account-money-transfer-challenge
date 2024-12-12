import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { User } from 'src/users/entities/user.entity';
import { VirtualAccount } from 'src/virtual-accounts/entities/virtual-account.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, VirtualAccount])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
