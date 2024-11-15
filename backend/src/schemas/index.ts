import { readFileSync } from 'fs';
import { resolve } from 'path';
import { mergeTypeDefs } from '@graphql-tools/merge';

// resolve calculates the paths relative to the current file
const mealSchema = readFileSync(resolve('./src/schemas/meal.graphql'), { encoding: 'utf-8' });
const userSchema = readFileSync(resolve('./src/schemas/user.graphql'), { encoding: 'utf-8' });

export const typeDefs = mergeTypeDefs([mealSchema, userSchema]);