import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function withDatabaseName(value: string) {
  const queryStart = value.indexOf("?");
  const base = queryStart === -1 ? value : value.slice(0, queryStart);
  const query = queryStart === -1 ? "" : value.slice(queryStart);

  if (/\/[^/?]+$/.test(base)) {
    return value;
  }

  return `${base.replace(/\/$/, "")}/whisper-pages${query}`;
}

export const mongoClientPromise =
  globalForMongo.mongoClientPromise ?? new MongoClient(withDatabaseName(uri)).connect();

globalForMongo.mongoClientPromise = mongoClientPromise;
