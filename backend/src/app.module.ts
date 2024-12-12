// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { typeOrmConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/entities/user.entity';
import { VirtualAccount } from './virtual-accounts/entities/virtual-account.entity';
import { Transaction } from './transactions/entities/transaction.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      renderPath: '/',
      exclude: ['/api*'],
    }),
    AuthModule,
    UsersModule,
    TransactionsModule,
    VirtualAccountsModule,
    TypeOrmModule.forFeature([User, VirtualAccount, Transaction]),
  ],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module';
// import { TransactionsModule } from './transactions/transactions.module';

// @Module({
//   imports: [AuthModule, UsersModule, VirtualAccountsModule, TransactionsModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
