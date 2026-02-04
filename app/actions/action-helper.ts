"use server";
import { headers } from "next/headers";
import { formDataToNestedObject } from "@/lib/formDataUtils";
import { Ratelimit } from "@upstash/ratelimit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import type { Session } from "next-auth";
type ActionResult<R=unknown> = {
  ok: boolean;
  message?: string;
  data?:R;
};

export async function handleAction<T, R>(
  formData: FormData,
  schema: z.ZodType<T>,
  handler: (data: T) => Promise<R>,
  options?: {
    revalidate?: string | string[];
    invalidMessage?: string;
    errorMessage?: string;
  }
): Promise<ActionResult<R>> {
  const raw = formDataToNestedObject(formData);
  console.log("raw: ",raw);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    return {
      ok: false,
      message: options?.invalidMessage ?? "Invalid form data",
    };
  }

  try {
    const res=await handler(parsed.data);

    if (options?.revalidate) {
      const paths = Array.isArray(options.revalidate)
        ? options.revalidate
        : [options.revalidate];

      paths.forEach((p) => revalidatePath(p));
    }

    return { ok: true, data:res };
  } catch (err) {
    console.error("Server Action Error:", err);
    return {
      ok: false,
      message: options?.errorMessage ?? "Something went wrong",
    };
  }
}
type AuthenticatedSession = Session & {
  user: {
    id: string;
  } & NonNullable<Session["user"]>;
};
// Overload 1 — Auth required (default)
export async function Guard(
  limiter: Ratelimit,
  options?: { requireAuth?: true; errorMessage?: string }
): Promise<AuthenticatedSession>;

// Overload 2 — No auth required
export async function Guard(
  limiter: Ratelimit,
  options: { requireAuth: false; errorMessage?: string }
): Promise<null>;

export async function Guard(
  limiter: Ratelimit,
  options?: {
    requireAuth?: boolean;   // default true
    errorMessage?: string;
  }
):Promise<AuthenticatedSession | null> {
  //RateLimit and Authentication
  // 🛑 Stage 1 — IP based pre-check (NO DB)
  const h = headers();
    const ip = 
    (await h).get("x-forwarded-for")?.split(",")[0] ??
    (await h).get("x-real-ip") ??
    "unknown";

  const { success: ipOk } = await limiter.limit(`ip:${ip}`);
  if (!ipOk) {
    throw new Error("Too many requests from this network. Slow down.");
  }

  // 🔐 Stage 2 — Auth only if needed
  if (options?.requireAuth !== false) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { success: userOk } = await limiter.limit(`user:${session.user.id}`);
    if (!userOk) {
      throw new Error(
        options?.errorMessage ?? "Too many requests. Please slow down."
      );
    }
    return session as AuthenticatedSession;
  }
  return null;
}