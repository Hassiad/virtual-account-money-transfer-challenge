import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { VirtualAccount } from '../virtual-accounts/entities/virtual-account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VirtualAccount)
    private virtualAccountRepository: Repository<VirtualAccount>,
  ) {}

  async createTransaction(
    senderId: string,
    recipientEmail: string,
    amount: number,
  ): Promise<Transaction> {
    // Find sender's virtual account
    const senderAccount = await this.virtualAccountRepository.findOne({
      where: { user: { id: senderId } },
      relations: ['user'],
    });

    // Find recipient
    const recipient = await this.userRepository.findOne({
      where: { email: recipientEmail },
      relations: ['virtualAccount'],
    });

    // Validate transaction
    if (!senderAccount || !recipient) {
      throw new BadRequestException('Sender or recipient not found');
    }

    if (senderAccount.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Update balances
    senderAccount.balance -= amount;
    recipient.virtualAccount.balance += amount;

    // Create transaction
    const transaction = this.transactionRepository.create({
      sender: senderAccount.user,
      recipient: recipient,
      amount: amount,
    });

    // Perform transaction in a single transaction
    await this.transactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(senderAccount);
        await transactionalEntityManager.save(recipient.virtualAccount);
        await transactionalEntityManager.save(transaction);
      },
    );

    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [{ sender: { id: userId } }, { recipient: { id: userId } }],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async searchTransactions(
    userId: string,
    searchTerm: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.sender', 'sender')
      .leftJoinAndSelect('transaction.recipient', 'recipient')
      .where(
        '(sender.email ILIKE :searchTerm OR recipient.email ILIKE :searchTerm)',
        {
          searchTerm: `%${searchTerm}%`,
        },
      )
      .andWhere('(sender.id = :userId OR recipient.id = :userId)', { userId })
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();
  }
}
