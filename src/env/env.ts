import * as dev from './env.dev';
import * as prod from './env.prod';
export const API_URL =
  process.env.NODE_ENV === 'production' ? prod.API_URL : dev.API_URL;
export const API_DOC_URL =
  process.env.NODE_ENV === 'production' ? prod.API_DOC_URL : dev.API_DOC_URL;
