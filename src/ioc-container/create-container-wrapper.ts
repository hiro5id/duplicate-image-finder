import { createContainer } from './create-container';
import { IContainerWrapper } from './container-wrapper.interface';
import { interfaces } from './lib';

export function createContainerWrapper(): IContainerWrapper {
  return new ContainerWrapper(createContainer());
}

/**
 * This can be used to string together multiple configureations, typically used in a monorepo
 */
class ContainerWrapper implements IContainerWrapper {
  constructor(private readonly inversifyContainer: interfaces.Container) {}

  public loadConfiguration(container: interfaces.Container): IContainerWrapper {
    container.parent = this.inversifyContainer;
    return new ContainerWrapper(container);
  }

  // @ts-ignore
  private ContainerWrapperBrand: void;

  get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this.inversifyContainer.get<T>(serviceIdentifier);
  }
}
