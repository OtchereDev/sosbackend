import { Controller } from '@nestjs/common';
import { GuideService } from './guide.service';

@Controller('guide')
export class GuideController {
  constructor(private service: GuideService) {}
}
