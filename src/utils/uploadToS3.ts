import fs from 'fs';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: fs.ReadStream;
}

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(
  files: string[],
  bucketName: string
): Promise<void> {
  // Configure AWS SDK
  const s3 = new AWS.S3();

  // Upload each file to S3
  await Promise.all(
    files.map(async (filePath) => {
      const fileStream = fs.createReadStream(filePath);

      const uploadParams: S3UploadParams = {
        Bucket: bucketName,
        Key: filePath,
        Body: fileStream,
      };

      try {
        await s3.upload(uploadParams).promise();
        console.log(`File uploaded successfully: ${filePath}`);
      } catch (error) {
        console.error(`Error uploading file ${filePath}:`, error);
        throw error;
      }
    })
  );

  console.log('All files uploaded to S3 successfully.');
}
