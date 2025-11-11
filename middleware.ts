import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedPaths = ["/participant", "/researcher"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables are missing. Middleware auth checks are skipped."
    );
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name, options) {
        response.cookies.delete({
          name,
          ...options,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPage = pathname.startsWith("/auth");

  if (!session && isProtected) {
    const redirectUrl = new URL("/auth/sign-in", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session) {
    const role =
      (session.user.user_metadata?.role as
        | "researcher"
        | "participant"
        | undefined) ?? "participant";

    if (pathname.startsWith("/researcher") && role !== "researcher") {
      return NextResponse.redirect(new URL("/participant", request.url));
    }

    if (pathname.startsWith("/participant") && role !== "participant") {
      return NextResponse.redirect(new URL("/researcher", request.url));
    }

    if (isAuthPage) {
      return NextResponse.redirect(
        new URL(
          role === "researcher" ? "/researcher" : "/participant",
          request.url
        )
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/researcher/:path*", "/participant/:path*", "/auth/:path*"],
};

