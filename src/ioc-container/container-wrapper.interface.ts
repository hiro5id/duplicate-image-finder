import { interfaces } from './lib';

export interface IContainerWrapper {
  loadConfiguration(container: interfaces.Container): IContainerWrapper;

  get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T;
}
