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
  majorVersion: 0,
  releaseBranches: {
    beta: {
      majorVersion: 1,
      prerelease: 'beta',
      npmDistTag: 'beta',
    },
  },
  // Publish configuration
  defaultReleaseBranch: 'main',
  packageManager: javascript.NodePackageManager.NPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  // python: {
  //   distName: 'alma-cdk.project',
  //   module: 'alma_cdk.project',
  // },
  publishToGo: {
    moduleName: 'github.com/alma-cdk/project-go',
  },

  // Dependencies
  minNodeVersion: nodejsVersion,
  cdkVersion: '2.24.1',
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
  gitignore: [
    '.DS_Store',
    '/examples/**/cdk.context.json',
    '/examples/**/node_modules',
    '/examples/**/cdk.out',
    '/examples/**/.git',
    'TODO.md',
  ],

});

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});

project.synth();
