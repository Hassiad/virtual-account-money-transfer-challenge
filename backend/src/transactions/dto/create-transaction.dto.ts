// src/transactions/dto/create-transaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPositive, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  @IsEmail()
  recipientEmail: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 100.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}
