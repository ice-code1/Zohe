import { clerkMiddleware } from "@clerk/nextjs/server";


// This config applies Clerk authentication middleware to the specified routes
export default clerkMiddleware({
    publicRoutes:['/', '/api/webhook/clerk'],
    ignoredRoutes: ['/api/webhook/clerk']
}) 
export const config = {
  matcher: [
    /*
      Match all routes except the following:
      - Static files (e.g., anything with a file extension like .png, .css, etc.)
      - _next directory (Next.js internals)
      - Specific API routes, trpc routes, or any route you want to protect
    */
    "/((?!_next|.*\\..*|api/public).*)",
    "/(api|trpc)(.*)",
  ],
};
