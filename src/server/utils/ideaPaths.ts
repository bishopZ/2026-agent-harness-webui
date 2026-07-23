import fs from 'fs';
import path from 'path';

/**
 * Resolve the on-disk folder for an idea under an initiative.
 * Prefers flat layout `initiatives/[Init]/[Proj]/[Idea]/`.
 * If a legacy `projects/` container exists, uses that instead.
 */
export const resolveIdeaFolderPath = (
  harnessRoot: string,
  initiativeName: string,
  projectName: string,
  ideaName: string
): string => {
  const initPath = path.join(harnessRoot, 'initiatives', initiativeName);
  const explicitProjects = fs.existsSync(path.join(initPath, 'projects'))
    && fs.statSync(path.join(initPath, 'projects')).isDirectory();

  if (explicitProjects) {
    return path.join(initPath, 'projects', projectName, ideaName);
  }
  return path.join(initPath, projectName, ideaName);
};
