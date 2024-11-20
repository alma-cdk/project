import { Tags } from 'aws-cdk-lib';
import { capitalCase, pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { hasAccount, hasEnvironment, useCompatibilityV0Tags, useLegacyTags } from './checks';
import { tagKey, Values } from './values';
import { isNonEmptyString } from '../../utils/isNonEmptyString';

interface Tagger {
  (scope: Construct, tags: Tags, values: Values): void;
}

export const tagAccount: Tagger = (_: Construct, tags: Tags, values: Values) => {
  if (hasAccount(values)) {
    tags.add(tagKey.ACCOUNT, values.accountType!);
  }
};

export const tagEnvironment: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  if (hasEnvironment(values)) {
    tags.add(tagKey.ENVIRONMENT, values.environmentType!);

    if (useLegacyTags(scope)) {
      tags.add(
        tagKey.LEGACY_PROJECT_ENVIRONMENT,
        `${pascalCase(values.projectName)}${pascalCase(values.environmentType!)}`,
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

export const tagAuthorName: Tagger = (_: Construct, tags: Tags, values: Values) => {
  tags.add(tagKey.AUTHOR_NAME, values.authorName);
};

export const tagAuthorOrganization: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  if (!useCompatibilityV0Tags(scope) && isNonEmptyString(values.authorOrganization)) {
    tags.add(tagKey.AUTHOR_ORGANIZATION, values.authorOrganization);
  }
};

export const tagAuthorEmail: Tagger = (scope: Construct, tags: Tags, values: Values) => {
  if (!useCompatibilityV0Tags(scope) && isNonEmptyString(values.authorEmail)) {
    tags.add(tagKey.AUTHOR_EMAIL, values.authorEmail);
  }
};
