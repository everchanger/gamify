import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();
const client = new MongoClient(config.MONGODB_URI);
const clientPromise = client.connect();

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing email or password",
      });
    }

    const database = (await clientPromise).db(config.MONGODB_DATABASE);
    const collection = database.collection("user");
    let user = await collection.findOne({ email });

    // If a user do not exist, create one
    if (user) {
      if (!bcrypt.compareSync(password, user.hash)) {
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthenticated",
        });
      }
    } else {
      const insertResult = await collection.insertOne({
        email,
        hash: bcrypt.hashSync(password, config.PASSWORD_ROUNDS),
      });
      if (!insertResult.acknowledged) {
        throw createError({
          statusCode: 500,
          statusMessage: "Error creating user",
        });
      }
    }

    // Create a token for this user
    const token = jwt.sign({ email: email }, config.JWT_SECRET);

    setCookie(event, "token", token, { httpOnly: true });

    return {
      ok: true,
    };
  } catch (error: any) {
    sendError(event, error);
  }
});
