import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, Blog } from "../types";
import { generateFullBlog } from "../utils/blogGenerator";

export class BlogFetch extends OpenAPIRoute {
	schema = {
		tags: ["Blogs"],
		summary: "Get a single Blog by slug",
		request: {
			params: z.object({
				blogSlug: Str({ description: "Blog slug" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns a single blog if found",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							blog: Blog,
						}),
					},
				},
			},
			"404": {
				description: "Blog not found",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							error: Str(),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated slug
		const { blogSlug } = data.params;

		// Extract blog number from slug (format: blog-post-0, blog-post-1, etc.)
		const match = blogSlug.match(/blog-post-(\d+)/);
		
		if (!match) {
			return Response.json(
				{
					success: false,
					error: "Blog not found",
				},
				{
					status: 404,
				}
			);
		}

		const blogNumber = parseInt(match[1], 10);

		// Check if blog number is within range
		if (blogNumber < 0 || blogNumber >= 10000) {
			return Response.json(
				{
					success: false,
					error: "Blog not found",
				},
				{
					status: 404,
				}
			);
		}

		// Generate full blog on the fly
		const blog = generateFullBlog(blogNumber);

		return {
			success: true,
			blog,
		};
	}
}
