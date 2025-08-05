import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const AuthPaths = ["/order","/ticket","/checkout"];

export default withAuth(
  function middleware(req) {
    const token = JSON.stringify(req.nextauth);
    // console.log(`\n\n Ini di Middleware ${token}\n\n\n`);

    if(req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
      const token = req.nextauth.token;
      if (token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    
    if (req.nextUrl.pathname.startsWith("/join-organizer")) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.url)
        );
      }
      if (token.organizer === false) {
        return;
      }
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.url)
        );
      }
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/organizer")) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.url)
        );
      }

      if (token.organizer !== true) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (AuthPaths.some((path) => req.nextUrl.pathname.includes(path))) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.url)
        );
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);
