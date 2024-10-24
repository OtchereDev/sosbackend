import { Injectable } from '@nestjs/common';
// import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from 'agora-token';
import {
  RtcRole,
  RtmRole,
  RtcTokenBuilder,
  RtmTokenBuilder,
} from 'agora-access-token';

@Injectable()
export class AgoraService {
  generateRTCToken(userId: string, channel: string, r: string) {
    let role: number;
    let expireTime = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    if (r === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (r === 'audience') {
      role = RtcRole.SUBSCRIBER;
    }

    let rtc = RtcTokenBuilder.buildTokenWithAccount(
      process.env.AGORA_ID,
      process.env.AGORA_CERTIFICATE,
      channel,
      userId,
      role,
      privilegeExpireTime,
    );

    // const rtc = RtcTokenBuilder.buildTokenWithUid(
    //   process.env.AGORA_ID,
    //   process.env.AGORA_CERTIFICATE,
    //   channel,
    //   uid,
    //   role,
    //   tokenExpirationInSecond,
    //   privilegeExpirationInSecond,
    // );

    // const username = Date.now();
    // const time = Math.floor(Date.now() / 1000) + 600;

    // const rtc = RtcTokenBuilder.buildTokenWithUid(
    //   process.env.AGORA_ID,
    //   process.env.AGORA_CERTIFICATE,
    //   channel,
    //   0,
    //   RtcRole.PUBLISHER,
    //   time,
    //   time,
    // );

    return {
      status: 200,
      tokens: {
        rtc,
        rtm: '',
      },
    };
  }
}
