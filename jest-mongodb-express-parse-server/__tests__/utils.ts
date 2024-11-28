import { ListDatabasesResult, MongoClient } from 'mongodb';

export const generateRandomPort = (min = 1024, max = 65535) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const deleteTestDatabases = async (connection: MongoClient) => {
  try {
    const databaseNames = await connection.db().admin().listDatabases();
    const testDatabaseNames = databaseNames.databases
      .filter((db: ListDatabasesResult['databases'][0]) => db.name.startsWith('test_'));

    for (const database of testDatabaseNames) {
      await connection.db(database.name).dropDatabase();
      console.log(`-------------- Deleted database: ${database.name}`);
    }
  }
  catch (error) {
    console.error('Error deleting test databases:', error);
  }
  finally {
    await connection.close();
  }
};
