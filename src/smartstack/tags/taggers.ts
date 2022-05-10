import { Tags } from 'aws-cdk-lib';
import { capitalCase, pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { hasAccount, hasEnvironment, useLegacyTags } from './checks';
import { tagKey, Values } from './values';

interface Tagger {
  (scope: Construct, tags: Tags, values: Values): void;
}

export const tagAccount: Tagger = (_: Construct, tags: Tags, values: Values) => {
  if (hasAccount(values)) {
    tags.add(tagKey.ACCOUNT, values.accountType);
  }
};

export const tagEnvironment: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  if (hasEnvironment(values)) {
    tags.add(tagKey.ENVIRONMENT, values.environmentType);

    if (useLegacyTags(scope)) {
      tags.add(
        tagKey.LEGACY_PROJECT_ENVIRONMENT,
        `${pascalCase(values.projectName)}${pascalCase(values.environmentType)}`,
      );
    }
  }
};

export const tagProject: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  let value = values.projectName;
  if (useLegacyTags(scope)) {
    value = capitalCase(values.projectName);
  }
  tags.add(tagKey.PROJECT, value);
};

export const tagAuthorInfo: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  tags.add(tagKey.AUTHOR_NAME, values.authorName);
  tags.add(tagKey.AUTHOR_ORGANIZATION, values.authorOrganization);
  tags.add(tagKey.AUTHOR_EMAIL, values.authorEmail);
};