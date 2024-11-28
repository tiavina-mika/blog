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
import express from 'express';
import crypto from 'crypto';
import { deleteTestDatabases, generateRandomPort } from './utils';

export const wait = (ms = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let parseServer: any;
let server: http.Server;
let connection: MongoClient;

beforeAll(async () => {
  const port = generateRandomPort();
  const randomText = crypto.randomUUID();

  const appId = 'testAppId' + randomText;
  const masterKey = 'testMasterKey' + randomText;
  const serverURL = `http://localhost:${port}/parse`;

  const mongoUrl = process.env.MONGO_URL + 'test_' + randomText;
  
  // Connect to MongoDB
  connection = await MongoClient.connect(mongoUrl, {});

  // Configure Parse Server with MongoDB URI
  parseServer = new ParseServer({
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
    await deleteTestDatabases(connection);
  }
});