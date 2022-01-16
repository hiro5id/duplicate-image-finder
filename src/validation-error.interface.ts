export interface ValidationError {
  typeName: string;
  errors: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  ruleName: string;
  property: string;
  message: string;
}
