import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { BlogCreate } from "./endpoints/blogCreate";
import { BlogDelete } from "./endpoints/blogDelete";
import { BlogFetch } from "./endpoints/blogFetch";
import { BlogList } from "./endpoints/blogList";
import { BlogListMetadata } from "./endpoints/blogListMetadata";
import { BlogFetchContent } from "./endpoints/blogFetchContent";

// In-memory storage for blogs (replaces D1 database)
export interface BlogData {
	title: string;
	slug: string;
	content?: string;
	author: string;
	published: boolean;
	created_at: string;
	updated_at: string;
	image: string;
	excerpt: string;
}

export const blogsStore = new Map<string, BlogData>();

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use("/*", cors({
	origin: "*", // Allow all origins - adjust as needed for production
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
	exposeHeaders: ["Content-Length", "X-Request-Id"],
	maxAge: 600,
	credentials: true,
}));

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/blogs", BlogList);
openapi.get("/api/blogs/metadata", BlogListMetadata); // New: Paginated metadata endpoint
openapi.post("/api/blogs", BlogCreate);
openapi.get("/api/blogs/:blogSlug", BlogFetch);
openapi.get("/api/blogs/:blogSlug/content", BlogFetchContent); // New: Content-only endpoint
openapi.delete("/api/blogs/:blogSlug", BlogDelete);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
