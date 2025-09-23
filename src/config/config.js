/* eslint-disable no-undef */
import dotenv from 'dotenv';

dotenv.config();  

const config = {
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase',  // Default MongoDB URI if not set
  },
  server: {
    port: process.env.PORT || 3000,  // Default to 3000 if not set
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultsecretkey',  // Default JWT secret if not set
  },
};

export default config;
