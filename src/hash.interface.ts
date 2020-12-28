export interface Hash {
  /**
   * algorithm used for the hash
   */
  type: 'dhash';
  /**
   * version of the algorithm
   */
  version: 'v1';
  /**
   * the hash value in binary form
   *
   * @pattern "^[0-9]*$"
   */
  binaryHash: string;
}
