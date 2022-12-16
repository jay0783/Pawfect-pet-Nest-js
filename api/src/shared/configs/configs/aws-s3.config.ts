import { registerAs } from "@nestjs/config";


export const awsS3Register = registerAs("aws-s3", () => {
  const s3Config = {
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET
  };

  return s3Config;
});


export interface IS3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}
