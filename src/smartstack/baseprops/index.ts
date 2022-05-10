import { StackProps } from 'aws-cdk-lib';


interface TemporaryProps extends StackProps {
  description?: string;
}

export type BaseProps = Omit<StackProps, 'description'>;

export function getBaseProps(props: StackProps): BaseProps {
  const baseProps: TemporaryProps = Object.assign({}, props);
  delete baseProps.description;
  return baseProps;
}