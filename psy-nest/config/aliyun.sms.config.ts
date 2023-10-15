import { registerAs } from '@nestjs/config';

export default registerAs('aliyunSms', () => ({
  accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET,
  endpoint: process.env.ALIYUN_SMS_ENDPOINT,
  signName: process.env.ALIYUN_SMS_SIGN_NAME,
  templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE,
}));