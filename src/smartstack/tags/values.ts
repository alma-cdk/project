import { Construct } from 'constructs';
import { ProjectContext } from '../../context';

export interface Values {
  accountType?: string; // TODO allow fail (tryGet...) ??
  environmentType?: string;
  projectName: string;
  authorName: string;
  authorOrganization: string;
  authorEmail: string;
}

export enum tagKey {
  NAME='Name',
  ACCOUNT='Account',
  ENVIRONMENT='Environment',
  LEGACY_PROJECT_ENVIRONMENT='ProjectAndEnvironment',
  PROJECT='Project',
  AUTHOR_NAME='Author',
  AUTHOR_ORGANIZATION='Organization',
  AUTHOR_EMAIL='Contact',
}

export function resolveTagValues(scope: Construct): Values {
  return {
    accountType: ProjectContext.getAccountType(scope), // TODO allow fail (tryGet...) ???
    environmentType: ProjectContext.tryGetEnvironment(scope),
    projectName: ProjectContext.getName(scope),
    authorName: ProjectContext.getAuthorName(scope),
    authorOrganization: ProjectContext.getAuthorOrganization(scope),
    authorEmail: ProjectContext.getAuthorEmail(scope),
  };
}

