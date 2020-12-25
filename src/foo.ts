import { injectable } from './ioc-container';
import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';

//TODO: rename this class to soemthing more appropriate

@injectable()
export class Foo {
  public bar() {
    //todo: inject storage class implementation... example mongo/filesystem
    console.log('hi');
  }

  save(_chunk: FileAttributesWithTypeAndHash) {
    //todo: implement saving of metadata.
    //todo: call isImageMetadata function to validate that what we are saving is correct
  }
}
