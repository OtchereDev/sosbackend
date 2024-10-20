import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/LoginDTO.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDTO })
  login(@Body() body: LoginDTO) {
    return this.authService.login(body.email, body.password);
  }

  @Post('login-responder')
  @ApiBody({ type: LoginDTO })
  loginResponder(@Body() body: LoginDTO) {
    return this.authService.loginResponder(body.email, body.password);
  }
}
