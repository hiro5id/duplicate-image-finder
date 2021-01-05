import { Container, interfaces } from './lib';

export function createSingletonContainer(): interfaces.Container {
  return new Container({ defaultScope: 'Singleton' }) as any;
}
