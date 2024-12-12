import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { VirtualAccount } from '../virtual-accounts/entities/virtual-account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VirtualAccount)
    private virtualAccountRepository: Repository<VirtualAccount>,
    private jwtService: JwtService,
  ) {}

  async signup(userData: Partial<User>): Promise<User> {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Save user and virtual account
    await this.userRepository.save(user);

    // Generate virtual account
    const virtualAccount = this.virtualAccountRepository.create({
      accountNumber: this.generateAccountNumber(),
      balance: 1000, // Initial balance
      user,
    });
    await this.virtualAccountRepository.save(virtualAccount);

    return user;
  }

  // async signup(userData: CreateUserDto): Promise<User> {
  //   const { email, password, firstName, lastName } = userData;

  //   // Check if user already exists
  //   const existingUser = await this.userRepository.findOne({
  //     where: { email },
  //   });
  //   if (existingUser) {
  //     throw new ConflictException('User already exists');
  //   }

  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // Create user
  //   const user = this.userRepository.create({
  //     email,
  //     password: hashedPassword,
  //     firstName,
  //     lastName,
  //   });

  //   // Save user and virtual account
  //   await this.userRepository.save(user);

  //   // Generate virtual account
  //   const virtualAccount = this.virtualAccountRepository.create({
  //     accountNumber: this.generateAccountNumber(),
  //     balance: 1000, // Initial balance
  //     user,
  //   });
  //   await this.virtualAccountRepository.save(virtualAccount);

  //   return user;
  // }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private generateAccountNumber(): string {
    return Math.random().toString().slice(2, 12);
  }
}
