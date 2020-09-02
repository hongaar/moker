import { Project } from '..'

export const DEFAULT_GITIGNORE = ['node_modules/', 'lib/']

export async function gitignore(project: Project, extra: string[] = []) {
  project.gitignore.contents = [...DEFAULT_GITIGNORE, ...extra]
}
