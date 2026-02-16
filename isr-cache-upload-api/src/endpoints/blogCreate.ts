import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Blog } from "../types";
import { blogsStore } from "../index";

export class BlogCreate extends OpenAPIRoute {
	schema = {
		tags: ["Blogs"],
		summary: "Create a new Blog",
		request: {
			body: {
				content: {
					"application/json": {
						schema: Blog,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the created blog",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
									blog: Blog,
								}),
							}),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated request body
		const blogToCreate = data.body;

		const now = new Date().toISOString();

		// Store blog in memory
		const newBlog = {
			title: blogToCreate.title,
			slug: blogToCreate.slug,
			content: blogToCreate.content,
			author: blogToCreate.author,
			published: blogToCreate.published,
			created_at: blogToCreate.created_at || now,
			updated_at: now,
			image: blogToCreate.image,
			excerpt: blogToCreate.excerpt,
		};

		blogsStore.set(blogToCreate.slug, newBlog);

		// return the new blog
		return {
			success: true,
			blog: newBlog,
		};
	}
}
