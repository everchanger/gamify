import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

const client = new MongoClient(config.MONGODB_URI);
const clientPromise = client.connect();

export default defineEventHandler(async (event) => {
  try {
    const { token } = parseCookies(event);
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthenticated, no token",
      });
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    if (!decodedToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthenticated, token invalid",
      });
    }

    const database = (await clientPromise).db(config.MONGODB_DATABASE);
    const collection = database.collection("user");
    const results = await collection.findOne({ email: decodedToken.email });
    results.hash = undefined;
    return JSON.stringify(results);
  } catch (error: any) {
    sendError(event, error);
  }
});
