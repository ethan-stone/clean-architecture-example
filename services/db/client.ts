import { MongoClient } from "mongodb";

let client: MongoClient | undefined = undefined;

export async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI as string, {
      ignoreUndefined: true,
    });
    await client.connect();
  }
  return client;
}
