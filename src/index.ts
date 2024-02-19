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

    // Extract repository files
    const repoFiles = extractRepoFiles(outputDirPath);

    // Upload files to S3
    await uploadToS3(repoFiles, 'rockit1688');

    res.json({
      id: id,
    });
  } catch (error) {
    console.error('Error during cloning:', error);
    res.status(500).json({ error: 'Failed to clone repository' });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
