import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { IGoogleConfig } from '@app/config/config.model';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<IGoogleConfig>('GOOGLE_CONFIG').CLIENT_ID,
      clientSecret:
        configService.get<IGoogleConfig>('GOOGLE_CONFIG').CLIENT_SECRET,
      callbackURL:
        configService.get<IGoogleConfig>('GOOGLE_CONFIG').REDIRECT_URL,
      scope: configService.get<IGoogleConfig>('GOOGLE_CONFIG').SCOPE,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      username: `${name.givenName} ${name?.familyName || ''}`,
    };

    done(null, user);
  }
}
