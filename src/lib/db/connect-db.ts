import "server-only";

import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
    connection: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
    globalForMongoose.mongooseCache ?? {
        connection: null,
        promise: null,
    };

globalForMongoose.mongooseCache = cache;

const connectDB = async (): Promise<Mongoose> => {
    // ইতোমধ্যে connection থাকলে সেটিই ব্যবহার করবে
    if (cache.connection) {
        return cache.connection;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error(
            "MONGODB_URI is not defined. Add it to your .env.local file."
        );
    }

    // একই সময়ে একাধিক connection request এলে
    // একই promise ব্যবহার করবে
    if (!cache.promise) {
        cache.promise = mongoose
            .connect(mongoUri, {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
            })
            .catch((error: unknown) => {
                // Failed promise cache করে রাখব না
                cache.promise = null;
                throw error;
            });
    }

    try {
        cache.connection = await cache.promise;

        if (process.env.NODE_ENV === "development") {
            console.log("MongoDB connected successfully");
        }

        return cache.connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export default connectDB;