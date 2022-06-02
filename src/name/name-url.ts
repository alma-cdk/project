import { paramCase } from 'change-case';
import { Construct } from 'constructs';
import { NameProps } from './interfaces';
import { validateMaxLength } from './max-length';
import { Name } from './name';
import { trim } from './trim';

export abstract class UrlName extends Name {
  public static it(scope: Construct, baseName: string, props?: NameProps): string {
    const result = paramCase(super.it(scope, baseName));
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static withProject(scope: Construct, baseName: string, props?: NameProps): string {
    const result = paramCase(super.withProject(scope, baseName));
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static globally(scope: Construct, baseName: string, props?: NameProps): string {
    const result = paramCase(super.globally(scope, baseName));
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
}
