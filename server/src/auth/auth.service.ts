import { Injectable, UnauthorizedException, ConflictException, Res, HttpStatus} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
    private readonly googleClient: OAuth2Client;
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {
      this.googleClient = new OAuth2Client(
        this.configService.get('GOOGLE_CLIENT_ID'),
        this.configService.get('GOOGLE_CLIENT_SECRET'),
      );
    }
    async signIn(@Res() res: Response, userName: string, pass: string): Promise<any> {
      const user = await this.usersService.getUserByUsername(userName);
      
      // Check if the password is correct
      if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException();
      }
    
      const payload = { sub: user.id, username: user.userName };
      const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' }); 
    
      // Set the JWT in a cookie
      res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' });
    
      // Send the response
      res.status(HttpStatus.OK).json({ user: {name: user.userName, picture: user.picture } });

      // log to the console
      console.log(`User ${user.userName} has logged in`);
    }

    async signUp(@Res() res: Response, name: string, pass: string): Promise<any> {
      const existingUser = await this.usersService.getUserByUsername(name);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(pass, 10);

      const user = await this.usersService.createUser({userName: name, password: hashedPassword } as User);
      const payload = { sub: user.id, username: user.userName };
      const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' }); // Token expires in 1 hour

      // Set the JWT in a cookie
      res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' });

      // Send the response
      res.status(HttpStatus.OK).json({ user: {name: user.userName, picture: user.picture } });

      console.log(`User ${user.userName} has logged in`);
    }

    async googleLogin(res: Response, idToken: string) {
      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken,
          audience: this.configService.get('GOOGLE_CLIENT_ID'),
        });
  
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
  
        let existingUser = await this.usersService.getUserByUsername(name);
  
        if (!existingUser) {
          existingUser = await this.usersService.createUser({
            userName: name,
            email: email,
            password: idToken,
            picture: picture,
          } as User);
        }
  
        const jwtPayload = { sub: existingUser.id, username: existingUser.userName };
        const token = await this.jwtService.signAsync(jwtPayload, { expiresIn: '1h' });
  
        res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' });
        res.status(HttpStatus.OK).json({ user: { name: name } });
        console.log(`User ${name} has logged in`);
      } catch (error) {
        throw new UnauthorizedException('Invalid Google ID token');
      }
    }

    async getProfile(token: string, res: Response) {
      try {
        // Check if the user exist and the JWT token is valid
        const payload = this.jwtService.verify(token);
        const user = await this.usersService.getUserById(payload.sub);

        if (!user) {
          throw new UnauthorizedException();
        }

        res.status(HttpStatus.OK).json({ user: {name: user.userName, picture: user.picture } });
      } catch (error) {
        throw new UnauthorizedException();
      }
    }

    async getNewAccessToken(refreshToken: string): Promise<any> {
      try {
        const response = await axios.post(
          'https://accounts.google.com/o/oauth2/token',
          {
            client_id: this.configService.get('GOOGLE_CLIENT_ID'),
            client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
        );

        const accessToken = response.data.access_token;

        // Get the user profile using the new access token
        const profileResponse = await this.getGoogleProfile(accessToken);

        return {
          access_token: accessToken,
          user: profileResponse.data
        };
      } catch (error) {
        throw new Error('Failed to refresh the access token.');
      }
    }  
    async getGoogleProfile(token: string) {
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
      // try {
      //   await axios.get(
      //     `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      //   );
      // } catch (error) {
      //   console.error('Failed to revoke the token:', error);
      // }
    }
}
