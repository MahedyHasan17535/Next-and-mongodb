import { auth } from "@/lib/auth";

export async function GET() {
  const ctx = await auth.$context;

  return Response.json({
    envUrl: process.env.BETTER_AUTH_URL ?? null,
    baseURL: ctx.baseURL,
    googleRedirect: `${ctx.baseURL}/callback/google`,
  });
}