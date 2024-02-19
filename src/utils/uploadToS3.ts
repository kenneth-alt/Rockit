import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: fs.ReadStream | Buffer;
}

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(
  filePaths: string[],
  projectId: string,
  bucketName: string
): Promise<void> {
  // Configure AWS SDK
  const s3 = new AWS.S3();

  // Upload each file to S3
  try {
    for (const filePath of filePaths) {
      const relativeFilePath = path.relative(
        path.join(__dirname, 'output'),
        filePath
      );
      const key = `output/${projectId}/${relativeFilePath.replace(/\\/g, '/')}`;

      const fileContent = fs.readFileSync(filePath);

      const uploadParams: S3UploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
      };

      await s3.upload(uploadParams).promise();
    }
  } catch (error) {
    console.error(`Error during upload:`, error);
    throw error;
  }

  console.log('All files uploaded to S3 successfully.');
}
