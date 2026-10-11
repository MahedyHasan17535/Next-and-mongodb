import { MongoClient } from "mongodb";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URL as string, {
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await client.connect();
    await client.db("bazar-dor").command({ ping: 1 });

    return Response.json({ ok: true, message: "MongoDB connected" });
  } catch (error) {
    return Response.json({
      ok: false,
      error: String(error),
      hasMongoUrl: !!process.env.MONGODB_URL,
    });
  } finally {
    await client.close();
  }
}