import path from 'path';
import { loadTemplate, renderTemplate, TemplateContext } from '../../template';
import { isSet } from '../../utils/isSet';
const template = loadTemplate(path.join(__dirname, 'name.njk'));

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
  if (isSet(props.override)) return props.override!;

  // otherwise user our recommended format
  return renderTemplate(template, <TemplateProps>{
    stackId: props.stackId,
    projectName: props.projectName,
    account: props.accountType,
    environment: props.environmentType,
  });
}