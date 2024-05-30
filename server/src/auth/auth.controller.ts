import {
    Body,
    Controller,
    Get,
    Res,
    Req,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CheckTokenExpiryGuard } from './auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { get } from 'node:http';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Post('signin')
  signIn(@Res() res: Response, @Body() signInDto: Record<string, any>) {
    return this.authService.signIn(res, signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Res() res: Response, @Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(res, signUpDto.username, signUpDto.password);
  }
  
  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.revokeGoogleToken(refreshToken);
    res.json({ message: 'Logout successful' });
  }

  @Post('google')
  // @UseGuards(AuthGuard('google'))
  googleLogin(@Body() body: Record<string, any>, @Res() res: Response){
    return this.authService.googleLogin(res, body.idToken);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  pofile(@Req() req, @Res() res: Response){
    return this.authService.getProfile(req.cookies['access_token'], res);
  }


  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleLoginCallback(@Request() req, @Res() res: Response) {
  //   const googleToken = req.user.accessToken;
  //   const googleRefreshToken = req.user.refreshToken;

  //   res.cookie('access_token', googleToken, { httpOnly: true });
  //   res.cookie('refresh_token', googleRefreshToken, {
  //     httpOnly: true,
  //   });

  //   res.redirect('http://localhost:3000/auth/profile');
  // }

  // @UseGuards(CheckTokenExpiryGuard)
  // @Get('profile')
  // async getProfile(@Request() req) {
  //   const accessToken = req.cookies['access_token'];
  //   if (accessToken)
  //     return (await this.authService.getProfile(accessToken)).data;
  //   throw new UnauthorizedException('No access token');
  // }

}