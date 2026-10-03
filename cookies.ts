import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(req: Request): CookieOptions {
  // Local HTTP cannot store Secure cookies. Keep localhost handling separate;
  // public Preview is HTTPS even when the upstream request is HTTP internally.
  const isLocalHttp = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  return isLocalHttp
    ? { httpOnly: true, path: "/", sameSite: "lax", secure: false }
    : { httpOnly: true, path: "/", sameSite: "none", secure: true };
}
