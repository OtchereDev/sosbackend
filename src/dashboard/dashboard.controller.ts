import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponderDashboardDTO } from './dto/Dashboard.dto';
import { ResponderAuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Post('/responder')
  @UseGuards(ResponderAuthGuard)
  async getResponderDashboard(
    @Body() body: ResponderDashboardDTO,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.sub;
    const [lat, long] = body.location.split(',');
    const response = await this.service.getResponderDashboard(
      [parseFloat(long), parseFloat(lat)],
      userId,
    );

    return res.status(response.status).json(response);
  }
}
