import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Blog = z.object({
	title: Str({ example: "My First Blog Post" }),
	slug: Str(),
	content: Str({ required: false }),
	author: Str({ example: "John Doe" }),
	published: z.boolean().default(false),
	created_at: DateTime(),
	updated_at: DateTime({ required: false }),
	image: Str({ example: "https://picsum.photos/seed/blog-0/800/600" }),
	excerpt: Str({ example: "A short preview of the blog post content..." }),
});

// Blog metadata without content (for list endpoints)
export const BlogMetadata = z.object({
	title: Str({ example: "My First Blog Post" }),
	slug: Str(),
	author: Str({ example: "John Doe" }),
	published: z.boolean().default(false),
	created_at: DateTime(),
	updated_at: DateTime({ required: false }),
	image: Str({ example: "https://picsum.photos/seed/blog-0/800/600" }),
	excerpt: Str({ example: "A short preview of the blog post content..." }),
});

// Blog content only
export const BlogContent = z.object({
	slug: Str(),
	content: Str(),
});
