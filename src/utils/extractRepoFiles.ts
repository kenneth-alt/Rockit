import fs from 'fs';
import path from 'path';

export function extractRepoFiles(outputDirPath: string) {
  let response: string[] = [];

  const repoContent = fs.readdirSync(outputDirPath);
  repoContent.forEach((file) => {
    const fullFilePath = path.join(outputDirPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(extractRepoFiles(fullFilePath));
    } else {
      response.push(file);
    }
  });
  return response;
}
