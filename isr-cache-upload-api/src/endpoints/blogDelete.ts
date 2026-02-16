import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, Blog } from "../types";
import { blogsStore } from "../index";

export class BlogDelete extends OpenAPIRoute {
	schema = {
		tags: ["Blogs"],
		summary: "Delete a Blog",
		request: {
			params: z.object({
				blogSlug: Str({ description: "Blog slug" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns if the blog was deleted successfully",
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

		// Retrieve the validated slug
		const { blogSlug } = data.params;

		 // Fetch the blog before deleting
		const blog = blogsStore.get(blogSlug);

		if (!blog) {
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

		// Delete the blog from in-memory store
		blogsStore.delete(blogSlug);

		// Return the deleted blog for confirmation
		return {
			result: {
				blog,
			},
			success: true,
		};
	}
}
