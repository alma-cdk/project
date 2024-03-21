const { awscdk, TextFile, javascript } = require('projen');

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
  python: {
    distName: 'alma-cdk.project',
    module: 'alma_cdk.project',
  },
  publishToGo: {
    moduleName: 'github.com/alma-cdk/project-go',
  },

  // Dependencies
  cdkVersion: '2.133.0',
  constructsVersion: '10.3.0',
  devDeps: [
    '@types/nunjucks',
    'nunjucks',
  ],
  bundledDeps: [
    'change-case',
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

project.synth();
