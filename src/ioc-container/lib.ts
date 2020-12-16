import 'reflect-metadata'; // required for inversify decorators.  only import this once here, and consume this package where needed
import { inject, injectable, interfaces, unmanaged, Container, decorate } from 'inversify';

export { injectable, unmanaged, inject, Container, interfaces, decorate };
