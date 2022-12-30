import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

const client = new MongoClient(config.MONGODB_URI);
const clientPromise = client.connect();

export default defineEventHandler(async (event) => {
  try {
    const token = getRequestHeader(event, "authorization");
    //const { token } = parseCookies(event);
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthenticated, no token",
      });
    }

    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decodedToken = jwt.verify(tokenWithoutBearer, config.JWT_SECRET);

    if (!decodedToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthenticated, token invalid",
      });
    }

    const user = await readBody(event);
    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing user",
      });
    }

    const database = (await clientPromise).db(config.MONGODB_DATABASE);
    const collection = database.collection("user");

    const dbUser = await collection.findOne({ email: decodedToken.email });
    if (!dbUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "User missing from database",
      });
    }

    user.score = parseInt(dbUser.score || 0);
    user.totalScore = parseInt(dbUser.totalScore);

    for (const dbTask of dbUser.tasks) {
      const task = user.tasks?.find((t) => t.name === dbTask.name);
      if (task && dbTask.complete === false && task.complete === true) {
        user.score += parseInt(task.score);
        user.totalScore += parseInt(task.score);
      }
    }

    for (const dbGoal of dbUser.goals) {
      const goal = user.goals.find((g) => g.name === dbGoal.name);
      if (goal && dbGoal.progress !== goal.progress) {
        // Cant go past the score of the goal
        const score = parseInt(goal.score);
        const progress = parseInt(goal.progress);
        const dbProgress = parseInt(dbGoal.progress);
        let delta = progress - dbProgress;
        if (progress > score) {
          delta = score - dbProgress;
          goal.progress = score;
        }
        user.score -= delta;
      }
    }

    if (user.score < 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "Looks like someone's trying to cheat",
      });
    }

    const results = await collection.updateOne(
      { email: decodedToken.email },
      {
        $set: {
          goals: user.goals,
          tasks: user.tasks,
          score: user.score,
          totalScore: user.totalScore,
        },
      }
    );

    if (!results.acknowledged) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error updating user",
      });
    }

    return user;
  } catch (error: any) {
    sendError(event, error);
  }
});
