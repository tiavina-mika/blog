/**
 * 
 * This file is used to setup the environment for Jest tests.
 * It is executed before and after any test file.
 * So we can use it to start and stop the Parse Server, MongoDB, and other services.
 */
import http from 'http';
import { Db, MongoClient } from 'mongodb';
import { ParseServer } from 'parse-server';
import dotenv from 'dotenv';
import path from 'path';
import { initializeCloudinary } from '../src/config/config';
import express from 'express';
import crypto from 'crypto';
import { deleteTestDatabases, generateRandomPort } from './utils';

export const wait = (ms = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let parseServer: any;
let server: http.Server;
let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  console.log(' --------------------- beforeAll global --------------------- ');
  // Define global variables
  (global as any).IS_TEST = true;

  // Load environment variables
  await dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

  // Initialize Cloudinary
  initializeCloudinary();

  const port = generateRandomPort();
  const randomText = crypto.randomUUID();
  // const randomText = crypto.randomBytes(16).toString('hex');


  const appId = 'testAppId' + randomText;
  const masterKey = 'testMasterKey' + randomText;
  const serverURL = `http://localhost:${port}/parse`;

  const mongoUrl = process.env.MONGO_URL + 'test_' + randomText;
  console.log(' -------------- port: ', port, randomText, mongoUrl);
  
  // Connect to MongoDB
  connection = await MongoClient.connect(mongoUrl, {});
  db = await connection.db();

  // Configure Parse Server with MongoDB URI
  parseServer = new ParseServer({
    cloud: path.join(__dirname, '../src/cloud', 'index.ts'),
    databaseURI: mongoUrl,
    appId,
    masterKey,
    serverURL,
    allowClientClassCreation: true,
    allowExpiredAuthDataToken: false,
    encodeParseObjectInCloudFunction: false,
    // disable logs
    silent: true,
    // mock the files adapter to avoid an issue with the push adapter
    push: {
      queueOptions: {
        disablePushWorker: false,
        channel: 'my-specific-channel-' + randomText,
      },
      adapter: {
        send: () => Promise.resolve(),
        getValidPushTypes: () => [],
      },
    },
  });

  // Start the Parse Server
  await parseServer.start();
  const app = express();

  app.use('/parse', parseServer.app);
  server = app.listen(port, undefined);

});

/**
 * @error ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From "*.ts file"
 * @important add this as a workaround to the issue
 */
beforeEach(async () => {
  await wait(2000);
});

afterAll(async () => {
  // 1. Stop the Parse Server
  if (parseServer) {
    await parseServer.handleShutdown();
  }

  // 2. Stop the Express server
  if (server) {
    server.close();
  }
  // 3. Stop the MongoDB server
  if (connection) {
    // await connection.close();
    await deleteTestDatabases(connection);
  }
});