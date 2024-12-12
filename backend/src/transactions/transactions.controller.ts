// src/transactions/transaction.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money to another user' })
  async transfer(
    @Request() req,
    @Body()
    body: {
      recipientEmail: string;
      amount: number;
    },
  ) {
    return this.transactionService.createTransaction(
      req.user.id,
      body.recipientEmail,
      body.amount,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get user transactions' })
  async getTransactions(@Request() req) {
    return this.transactionService.getUserTransactions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('search')
  @ApiOperation({ summary: 'Search transactions' })
  async searchTransactions(@Request() req, @Query('term') searchTerm: string) {
    return this.transactionService.searchTransactions(req.user.id, searchTerm);
  }
}
