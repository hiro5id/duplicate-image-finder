# duplicate-image-finder

### Goals

- To work well over unlimited size folders and sub folders including network attached drives.  That means retry logic where necessary in case of intermittent disconnections.


#### Notes 2022-01-15:
* ~~I'm implementing the functionality to support writing multiple documents.~~
* ~~Genericify the type validation, and make use of it in `NuggetFileInterface.writeOrUpdate` to verify the `inputDocuments` and `filePath` parameters~~
* `TODO`: Implement a command line interface and test writing to file
* `TODO`: Make temp file be written to universal croll platform OS temp location


#### Notes 2022-01-04:
* I implemented the NuggetFileInterface which i'm going to use to update entire lines in existing files.  So far it is only able to add a new line to the end "END!!!" for testing.
  * Since I am using streaming to reduce memory usage, I had to use the trick of reading from one file and then writing to another temp file, then copying it back to the original at the end
  * this works and tested for both Windows and OSX
  * What needs to be done:
    * `TODO`:  Better Error: implement a check for existence of file, if there is no file then throw appropriate error before trying to stream, because on windows when the error occurs when there is no file, lots of extra garbage is being output into the console in addition to the error.
  * `TODO`: implement the functionality to insert or update a specific line in the file given a file path, and support an array of items, so that we can support bulk operations, so that we don't have to stream through the entire nugget file just to update one row... we should be able to update multiple rows at once.
* I decided that for the metadata (nugget) i will make it optional to provide the path to it on the command line when running the tool.  By default it will always look for the input data file (nugget) in the current directory where the executable is being run.  but provide optional ability to explicitly specify data file.
* In the data file (nugget) there will be no concept of "root" path but rather absolute paths for everything.  the disadvantage is that if a file is moved.


### Libraries
- Image type identifier: https://www.npmjs.com/package/image-type


### AJV validation key words
AJV is used for validation, and many of the keywords used for validation are defined here http://json-schema.org/draft/2019-09/json-schema-validation.html
