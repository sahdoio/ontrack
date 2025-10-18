import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME || 'ontrack-csv-uploads',
  },
  sns: {
    topicArn: process.env.SNS_TOPIC_ARN,
  },
  sqs: {
    notificationQueueUrl: process.env.SQS_NOTIFICATION_QUEUE_URL,
    csvProcessingQueueUrl: process.env.SQS_CSV_PROCESSING_QUEUE_URL,
  },
}));