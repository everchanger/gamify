import { MongoClient } from "mongodb";

const config = useRuntimeConfig();

const client = new MongoClient(config.MONGODB_URI);
const clientPromise = client.connect();

export default defineEventHandler(async (event) => {
  console.log(config.MONGODB_DATABASE);

  try {
    const database = (await clientPromise).db(config.MONGODB_DATABASE);
    const collection = database.collection("comments");
    const results = await collection.find({}).limit(10).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error: any) {
    return { statusCode: 500, body: error.toString() };
  }
});
