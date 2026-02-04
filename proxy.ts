import { NextResponse, NextRequest } from "next/server";
import { authLimiter } from "./lib/rate-limit/rate-limit";

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Only limit real login attempts
  if (
    req.method === "POST" &&
    (pathname.startsWith("/api/auth/signin") ||
      pathname.startsWith("/api/auth/signin/email"))
  ) {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    let id = req.cookies.get("rlid")?.value;
    if (!id) {
      id = crypto.randomUUID();
    }

    // Now TS knows id is definitely a string
    const key = `${ip}:${id}`;

    const { success, remaining, reset } = await authLimiter.limit(key);

    if (!success) {
      const url = new URL("/", origin);
      url.searchParams.set("error", "rate_limited");
      url.searchParams.set("remaining", remaining.toString());
      url.searchParams.set("reset", reset.toString());

      const res = NextResponse.redirect(url);
      res.cookies.set("rlid", id, {
        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
        sameSite: "lax",
      });

      return res;
    }

    const res = NextResponse.next();
    res.cookies.set("rlid", id, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
