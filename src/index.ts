import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import path from 'path';
import { generateId } from './utils/generateId';
import { extractRepoFiles } from './utils/extractRepoFiles';
import { uploadToS3 } from './utils/uploadToS3';

const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server is working!');
});

app.post('/deploy', async (req: Request, res: Response) => {
  const repoUrl = req.body.repoUrl;
  const id = generateId();
  const outputDirPath = path.join(__dirname, `output/${id}`);

  try {
    // Clone the repository
    await simpleGit().clone(repoUrl, outputDirPath);
  } catch (error) {
    console.error('Error during cloning:', error);
    return res.status(500).json({ error: 'Failed to clone repository' });
  }

  let repoFiles: string[];
  try {
    // Extract repository files
    repoFiles = extractRepoFiles(outputDirPath);
  } catch (error) {
    console.error('Error during extraction:', error);
    return res
      .status(500)
      .json({ error: 'Failed to extract repository files' });
  }

  try {
    // Upload files to S3
    await uploadToS3(repoFiles, id, 'rockit1688');
  } catch (error) {
    console.error('Error during upload:', error);
    return res.status(500).json({ error: 'Failed to upload files to S3' });
  }

  res.json({
    id: id,
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
