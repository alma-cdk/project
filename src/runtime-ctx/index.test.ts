import * as cdk from 'aws-cdk-lib';
import { getCtxAccount, getCtxEnvironment } from '.';

describe('RuntimeContext', () => {

  describe('Account Type', () => {

    describe('With Value', () => {
      test('--account-type=dev', () => {
        const app = new cdk.App({
          context: { 'account-type': 'dev' },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual('dev');
      });
      test('--account=dev', () => {
        const app = new cdk.App({
          context: { account: 'dev' },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual('dev');
      });
    });
    describe('No Value', () => {
      test('--account-type', () => {
        const app = new cdk.App({
          context: { 'account-type': undefined },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual(undefined);
      });
      test('--account', () => {
        const app = new cdk.App({
          context: { account: undefined },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual(undefined);
      });
    });
    describe('Priority', () => {
      test('fully-typed flag wins', () => {
        const app = new cdk.App({
          context: {
            'account-type': 'full',
            'account': 'short',
          },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual('full');
      });
      test('flag with value wins', () => {
        const app = new cdk.App({
          context: {
            'account-type': undefined,
            'account': 'short',
          },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxAccount(stack)).toEqual('short');
      });
    });
  });

  describe('Environment Type', () => {

    describe('With Value', () => {
      test('--environment-type=development', () => {
        const app = new cdk.App({
          context: { 'environment-type': 'development' },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual('development');
      });
      test('--environment=development', () => {
        const app = new cdk.App({
          context: { environment: 'development' },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual('development');
      });
      test('--env=development', () => {
        const app = new cdk.App({
          context: { env: 'development' },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual('development');
      });
    });

    describe('No Value', () => {
      test('--environment-type', () => {
        const app = new cdk.App({
          context: { 'environment-type': undefined },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual(undefined);
      });
      test('--environment', () => {
        const app = new cdk.App({
          context: { environment: undefined },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual(undefined);
      });
      test('--env', () => {
        const app = new cdk.App({
          context: { env: undefined },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual(undefined);
      });
    });

    describe('Priority', () => {
      test('fully-typed flag wins', () => {
        const app = new cdk.App({
          context: {
            'environment-type': 'full',
            'environment': 'short',
            'env': 'shortest',
          },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual('full');
      });
      test('flag with value wins', () => {
        const app = new cdk.App({
          context: {
            'environment-type': undefined,
            'environment': undefined,
            'env': 'shortest',
          },
        });
        const stack = new cdk.Stack(app);
        expect(getCtxEnvironment(stack)).toEqual('shortest');
      });
    });
  });
});
