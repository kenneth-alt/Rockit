import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import path from 'path';
import { generateId } from './utils/generateId';

const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server is working!');
});

app.post('/deploy', (req: Request, res: Response) => {
  const repoUrl = req.body.repoUrl;
  const id = generateId();
  simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  res.json({
    id: id,
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
