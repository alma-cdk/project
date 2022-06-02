import { Construct } from 'constructs';
import { NameProps } from './interfaces';
import { validateMaxLength } from './max-length';
import { UrlName } from './name-url';
import { trim } from './trim';

export abstract class PathName extends UrlName {
  public static it(scope: Construct, baseName: string, props?: NameProps): string {
    const result = `/${super.it(scope, '').replace(/-/g, '/')}/${baseName.replace(/[\.\s]/g, '')}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static withProject(scope: Construct, baseName: string, props?: NameProps): string {
    const result = `/${super.withProject(scope, '').replace(/-/g, '/')}/${baseName.replace(/[\.\s]/g, '')}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static globally(scope: Construct, baseName: string, props?: NameProps): string {
    const result = `/${super.globally(scope, '').replace(/-/g, '/')}/${baseName.replace(/[\.\s]/g, '')}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
}
