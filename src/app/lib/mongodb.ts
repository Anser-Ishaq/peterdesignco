import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

/**
 * Global cache for MongoDB connection
 * This prevents creating multiple connections in Vercel serverless
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ MongoDB: Using existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ MongoDB: Creating new connection...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("🎉 MongoDB: Connection established successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB: Connection failed", error);
        // Reset the cached promise so the next request can retry.
        // Otherwise a single failed attempt (e.g. paused cluster) keeps
        // throwing forever until the server is restarted.
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
