import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}
    async signIn(userName: string, pass: string): Promise<any> {
      const user = await this.usersService.getUserByUsername(userName);
      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.userName };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    async getNewAccessToken(refreshToken: string): Promise<string> {
      try {
        const response = await axios.post(
          'https://accounts.google.com/o/oauth2/token',
          {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
        );
  
        return response.data.access_token;
      } catch (error) {
        throw new Error('Failed to refresh the access token.');
      }
    }
  
    async getProfile(token: string) {
      try {
        return axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
        );
      } catch (error) {
        console.error('Failed to revoke the token:', error);
      }
    }
  
    async isTokenExpired(token: string): Promise<boolean> {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
        );
  
        const expiresIn = response.data.expires_in;
  
        if (!expiresIn || expiresIn <= 0) {
          return true;
        }
      } catch (error) {
        return true;
      }
    }
  
    async revokeGoogleToken(token: string) {
      try {
        await axios.get(
          `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
        );
      } catch (error) {
        console.error('Failed to revoke the token:', error);
      }
    }
}
