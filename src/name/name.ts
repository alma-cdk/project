import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { ProjectContext } from '../project';
import { NameProps } from './interfaces';
import { validateMaxLength } from './max-length';
import { trim } from './trim';

interface ContextualNamingInformation {
  readonly environment?: string;
  readonly projectName?: string;
  readonly organizationName?: string;
}

export class Name {

  public static it(scope: Construct, baseName: string, props?: NameProps): string {
    const info = Name.getContextualInformation(scope);
    const result = Name.nameIt(baseName, {
      environment: info.environment,
    });
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }

  public static withProject(scope: Construct, baseName: string, props?: NameProps): string {
    const info = Name.getContextualInformation(scope);
    const result = Name.nameIt(baseName, {
      environment: info.environment,
      projectName: info.projectName,
    });
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }

  public static globally(scope: Construct, baseName: string, props?: NameProps): string {
    const info = Name.getContextualInformation(scope);
    const result = Name.nameIt(baseName, {
      environment: info.environment,
      projectName: info.projectName,
      organizationName: info.organizationName,
    });
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }

  private static nameIt(baseName: string, info: ContextualNamingInformation): string {
    return `${info.organizationName || ''}${info.projectName || ''}${info.environment || ''}${pascalCase(baseName)}`;
  }

  private static getContextualInformation(scope: Construct): ContextualNamingInformation {
    return {
      environment: pascalCase(ProjectContext.tryGetEnvironment(scope) || ''),
      projectName: pascalCase(ProjectContext.getName(scope)),
      organizationName: pascalCase(ProjectContext.getAuthorOrganization(scope) || ''),
    };
  }
}
