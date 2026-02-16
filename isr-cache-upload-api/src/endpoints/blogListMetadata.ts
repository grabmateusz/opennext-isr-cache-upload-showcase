import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, BlogMetadata } from "../types";
import { generateBlogMetadata } from "../utils/blogGenerator";

export class BlogListMetadata extends OpenAPIRoute {
	schema = {
		tags: ["Blogs"],
		summary: "List Blog Metadata (without content)",
		request: {
			query: z.object({
				page: Num({
					description: "Page number (0-indexed)",
					default: 0,
				}),
				limit: Num({
					description: "Number of items per page",
					default: 10,
				}),
				isPublished: Bool({
					description: "Filter by published flag",
					required: false,
				}),
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of blog metadata",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							blogs: BlogMetadata.array(),
							total: Num(),
							page: Num(),
							limit: Num(),
							totalPages: Num(),
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
		const { page, limit, isPublished } = data.query;

		const totalBlogs = 10000;
		
		// Calculate total based on filter
		let total = totalBlogs;
		if (isPublished !== undefined) {
			// 2/3 published (index % 3 !== 0), 1/3 unpublished (index % 3 === 0)
			total = isPublished ? Math.floor(totalBlogs * 2 / 3) : Math.floor(totalBlogs / 3);
		}

		const totalPages = Math.ceil(total / limit);

		// Generate only the metadata needed for this page
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
			
			// Generate only the metadata we need for this page
			const metadata = generateBlogMetadata(i);
			paginatedBlogs.push(metadata);
			collected++;
		}

		return {
			success: true,
			blogs: paginatedBlogs,
			total,
			page,
			limit,
			totalPages,
		};
	}
}
