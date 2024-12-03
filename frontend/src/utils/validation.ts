import { Schema } from 'joi';
import { ValidationErrorItem } from 'joi';

export const validate = (schema: Schema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { valid: false, errors: error.details };
  }
  return { valid: true, value };
};


export const getErrorMessage = (errors: ValidationErrorItem[], field: string): string | null => {
  const error = errors.find((err) => err.path && err.path[0] === field);
  return error ? error.message : null;
};