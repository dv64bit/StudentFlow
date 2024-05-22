import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Check which pages are public and which need to hide behind authentication.
 */

// export default clerkMiddleware({
// createRouteMatcher: [
//   "/",
//   "/api/webhooks",
//   "/question/:id",
//   "/tags",
//   "/tags/:id",
//   "/profile/:id",
//   "/community",
//   "/jobs",
// ],
//   matcher: ["/api/webhooks", "/api/chatgpt"],
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

const isProtectedRoute = createRouteMatcher([
  // "/",
  "/api/webhooks",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
