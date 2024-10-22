import { Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from 'agora-token';

@Injectable()
export class AgoraService {
  generateRTCToken(userId: string, channel: string) {
    const rtm = RtmTokenBuilder.buildToken(
      process.env.AGORA_ID,
      process.env.AGORA_CERTIFICATE,
      userId,
      86400,
    );

    const rtc = RtcTokenBuilder.buildTokenWithUid(
      process.env.AGORA_ID,
      process.env.AGORA_CERTIFICATE,
      channel,
      userId,
      RtcRole.PUBLISHER,
      86400,
      86400,
    );

    return {
      status: 200,
      tokens: {
        rtc,
        rtm,
      },
    };
  }
}
