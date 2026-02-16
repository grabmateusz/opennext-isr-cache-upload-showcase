import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, BlogMetadata } from "../types";
import { generateBlogMetadata } from "../utils/blogGenerator";

export class BlogList extends OpenAPIRoute {
	schema = {
		tags: ["Blogs"],
		summary: "List Blogs",
		request: {
			query: z.object({
				page: Num({
					description: "Page number",
					default: 0,
				}),
				isPublished: Bool({
					description: "Filter by published flag",
					required: false,
				}),
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of blogs",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							blogs: BlogMetadata.array(),
							total: Num(),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated parameters
		const { page, isPublished } = data.query;

		const totalBlogs = 10000;
		const limit = 10;
		
		// Calculate total based on filter
		let total = totalBlogs;
		if (isPublished !== undefined) {
			// 2/3 published (index % 3 !== 0), 1/3 unpublished (index % 3 === 0)
			total = isPublished ? Math.floor(totalBlogs * 2 / 3) : Math.floor(totalBlogs / 3);
		}

		// Generate only the metadata needed for this page (no content)
		const paginatedBlogs = [];
		let collected = 0;
		let skipped = 0;
		const targetSkip = page * limit;
		
		for (let i = 0; i < totalBlogs && collected < limit; i++) {
			// Check if this blog matches the filter
			const isThisBlogPublished = (i % 3 !== 0);
			
			if (isPublished !== undefined && isThisBlogPublished !== isPublished) {
				continue;
			}
			
			// Skip blogs for previous pages
			if (skipped < targetSkip) {
				skipped++;
				continue;
			}
			
			// Generate only metadata (no content) - much faster and smaller
			const metadata = generateBlogMetadata(i);
			paginatedBlogs.push(metadata);
			collected++;
		}

		return {
			success: true,
			blogs: paginatedBlogs,
			total,
		};
	}
}
