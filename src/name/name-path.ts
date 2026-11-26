import { Construct } from "constructs";
import { NameProps } from "./interfaces";
import { MAX_LENGTH_PATH, validateMaxLength } from "./max-length";
import { UrlName } from "./name-url";
import { trim } from "./trim";

export abstract class PathName extends UrlName {
  public static it(
    scope: Construct,
    baseName: string,
    props?: NameProps,
  ): string {
    const result = `/${super.it(scope, "", prefixProps(props)).replace(/-/g, "/")}/${baseName.replace(/[\.\s]/g, "")}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static withProject(
    scope: Construct,
    baseName: string,
    props?: NameProps,
  ): string {
    const result = `/${super.withProject(scope, "", prefixProps(props)).replace(/-/g, "/")}/${baseName.replace(/[\.\s]/g, "")}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
  public static globally(
    scope: Construct,
    baseName: string,
    props?: NameProps,
  ): string {
    const result = `/${super.globally(scope, "", prefixProps(props)).replace(/-/g, "/")}/${baseName.replace(/[\.\s]/g, "")}`;
    const trimmed = trim(result, baseName, props);
    validateMaxLength(scope, trimmed, props?.maxLength);
    return trimmed;
  }
}

function prefixProps(props?: NameProps): NameProps {
  return { ...props, maxLength: props?.maxLength ?? MAX_LENGTH_PATH };
}
