import { Container, interfaces } from './lib';

export function createContainer(): interfaces.Container {
  return new Container({ defaultScope: 'Singleton' }) as any;
}
