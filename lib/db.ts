import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined, skipping DB connection for now.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    const db = await cached.promise;
    cached.conn = db.connection;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
