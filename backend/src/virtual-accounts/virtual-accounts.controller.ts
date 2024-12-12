import { Controller } from '@nestjs/common';
import { VirtualAccountsService } from './virtual-accounts.service';

@Controller('virtual-accounts')
export class VirtualAccountsController {
  constructor(private readonly virtualAccountsService: VirtualAccountsService) {}
}
