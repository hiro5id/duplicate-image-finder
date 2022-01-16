/**
 * gets the name of a property
 * @param prop - the object for which we want to get the property name
 * @param value - the value of the object for which we want the property name
 */
export function getPropName(prop: any, value: any): string {
  for (let i in prop) {
    // noinspection JSUnfilteredForInLoop
    if (prop[i] == value) {
      // noinspection JSUnfilteredForInLoop
      return i;
    }
  }
  return '-unknown-';
}
