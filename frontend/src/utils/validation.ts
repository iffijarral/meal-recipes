import { Schema } from 'joi';

export const validate = (schema: Schema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { valid: false, errors: error.details };
  }
  return { valid: true, value };
};