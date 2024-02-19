import fs from 'fs';
import path from 'path';

export function extractRepoFiles(outputDirPath: string): string[] {
  let response: string[] = [];

  const repoContent = fs.readdirSync(outputDirPath);
  repoContent.forEach((file) => {
    const fullFilePath = path.join(outputDirPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      const filesInSubdirectory = extractRepoFiles(fullFilePath);
      filesInSubdirectory.forEach((subfile) => {
        response.push(subfile);
      });
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}
