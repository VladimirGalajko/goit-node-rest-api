
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './envs/production.env' : './envs/development.env',
});
