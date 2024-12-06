import { Schema } from 'joi';
import { ValidationErrorItem } from 'joi';
import fileSchema from '../schemas/fileSchema.js';

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

export const validateFile = (file: File) => {
  const validationResult = fileSchema.validate({
      type: file.type,
      size: file.size,
  });

  if (validationResult.error) {
      throw new Error(validationResult.error.message);
  }
};