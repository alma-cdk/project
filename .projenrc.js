const { awscdk, TextFile, javascript } = require('projen');

const nodejsVersion = '14.17.6';

const project = new awscdk.AwsCdkConstructLibrary({

  // Metadata
  stability: 'experimental',
  authorName: 'Alma Media',
  authorOrganization: true,
  authorAddress: 'opensource@almamedia.dev',
  name: '@alma-cdk/project',
  description: 'Opinionated CDK Project “Framework”',
  repositoryUrl: 'https://github.com/alma-cdk/project.git',
  keywords: ['cdk', 'aws-cdk', 'awscdk', 'aws'],

  // Publish configuration
  defaultReleaseBranch: 'main',
  //npmAccess: javascript.NpmAccess.PUBLIC,

  // Dependencies
  minNodeVersion: nodejsVersion,
  cdkVersion: '2.1.0',
  constructsVersion: '10.0.0',
  peerDeps: ['constructs', 'aws-cdk-lib'],
  devDeps: [
    '@types/lodash',
    '@types/nunjucks',
    'aws-cdk-lib',
    'constructs',
    'lodash',
    'nunjucks',
  ],
  bundledDeps: [
    'change-case',
    'lodash',
    'nunjucks',
  ],

  // Gitignore
  gitignore: ['.DS_Store'],


});

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});


project.synth();
