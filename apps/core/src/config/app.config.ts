import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  name: process.env.APP_NAME || 'OnTrack',
  email: {
    from: process.env.EMAIL_FROM || 'noreply@ontrack.com',
  },
}));