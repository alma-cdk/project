import { renderTemplate, TemplateContext } from '../../template';
import { isNonEmptyString } from '../../utils/isSet';

const template = `{#
    Template for Stack Name prop
    --------------------------------------------------------------------------------
    AWS CloudFormation stack names have a maximum length of 128 characters.
    This template truncates various values if they exceed their limit:

    Max Lenghts:

    - No Environment or Account present:
      32+1+48 = 81

    - Environment present:
      32+1+32+13+48 = 126

    - Account present:
      32+1+32+9+48 = 122

    #}{#

    "MyProject-"
    #}{{ projectName | pascal | truncate(32, true, "") | append("-") }}{#

    #}{% if environment | notEmpty %}{#
      "Environment-Staging-"
      #}{{ environment | pascal | stripUnderscore | truncate(32, true, "") | prepend("Environment-") | append("-") }}{#

    #}{% elif account | notEmpty %}{#
      "Project-Account-"
      #}Account-{#

    #}{% endif %}{#

    "MyStack"
    #}{{ stackId | pascal | truncate(48, true, "")}}`;

interface TemplateProps extends TemplateContext {
  stackId: string;
  projectName: string;
  accountType?: string;
  environmentType?: string;
}

export interface NameProps {
  override?: string;
  stackId: string;
  projectName: string;
  accountType?: string;
  environmentType?: string;
}

export function formatName(props: NameProps): string {

  // allow end-user override
  if (isNonEmptyString(props.override)) return props.override!;

  // otherwise user our recommended format
  return renderTemplate(template, <TemplateProps>{
    stackId: props.stackId,
    projectName: props.projectName,
    account: props.accountType,
    environment: props.environmentType,
  });
}
