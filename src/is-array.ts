export function isArray(data: any): data is Array<any> {
  return data != null && data.length > 0;
}
