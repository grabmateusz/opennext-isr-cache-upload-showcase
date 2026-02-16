// Utility functions to generate blog data on the fly

const authors = [
	"John Doe",
	"Jane Smith",
	"Alice Johnson",
	"Bob Williams",
	"Charlie Brown",
	"Diana Prince",
	"Eve Wilson",
	"Frank Miller",
];

const topics = [
	"Web Development",
	"Cloud Computing",
	"AI and Machine Learning",
	"DevOps",
	"Cybersecurity",
	"Mobile Development",
	"Data Science",
	"Blockchain",
];

const loremParagraphs = [
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
	"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
	"Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
	"Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
	"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.",
	"Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure.",
	"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.",
];

export function generateBlogMetadata(index: number) {
	const baseDate = new Date("2024-01-01T00:00:00Z");
	const createdAt = new Date(baseDate.getTime() + index * 3600000); // 1 hour apart
	const topic = topics[index % topics.length];

	return {
		title: `${topic} - Blog Post ${index}`,
		slug: `blog-post-${index}`,
		author: authors[index % authors.length],
		published: index % 3 !== 0, // 2/3 published, 1/3 unpublished
		created_at: createdAt.toISOString(),
		updated_at: createdAt.toISOString(),
		image: `https://picsum.photos/seed/blog-${index}/800/600`,
		excerpt: `This is an automatically generated blog post about ${topic}. This comprehensive guide will explore various aspects of the topic in great detail.`.substring(0, 200),
	};
}

export function generateBlogContent(index: number): string {
	const topic = topics[index % topics.length];
	
	// Generate content that's approximately 100KB
	// Targeting around 100,000 characters of content
	let content = `# ${topic} - Blog Post ${index}\n\n`;
	content += `This is an automatically generated blog post about ${topic}. This comprehensive guide will explore various aspects of the topic in great detail.\n\n`;

	// Add a table of contents
	content += `## Table of Contents\n\n`;
	for (let i = 1; i <= 10; i++) {
		content += `${i}. Section ${i}: Understanding ${topic} - Part ${i}\n`;
	}
	content += `\n`;

	// Generate 10 sections with multiple paragraphs each
	for (let section = 1; section <= 10; section++) {
		content += `## Section ${section}: Understanding ${topic} - Part ${section}\n\n`;
		content += `### Introduction to Section ${section}\n\n`;
		
		// Add 3-4 paragraphs per section
		const paragraphsInSection = 3 + (section % 2);
		for (let p = 0; p < paragraphsInSection; p++) {
			const paraIndex = (section * 10 + p) % loremParagraphs.length;
			content += loremParagraphs[paraIndex] + ` `;
			content += `This is specifically relevant to ${topic} in the context of blog post ${index}, section ${section}, paragraph ${p + 1}. `;
			content += `Here are some key points to consider: `;
			
			// Add bullet points
			content += `\n\n`;
			for (let bullet = 1; bullet <= 5; bullet++) {
				content += `- **Point ${bullet}**: ${loremParagraphs[(paraIndex + bullet) % loremParagraphs.length].substring(0, 100)}...\n`;
			}
			content += `\n`;
		}

		// Add a code example every few sections
		if (section % 5 === 0) {
			content += `### Code Example ${section / 5}\n\n`;
			content += "```javascript\n";
			content += `// Example code for ${topic}\n`;
			content += `function processData${section}(input) {\n`;
			content += `  const result = [];\n`;
			content += `  for (let i = 0; i < input.length; i++) {\n`;
			content += `    // Processing step ${section}\n`;
			content += `    const processed = transformData(input[i]);\n`;
			content += `    result.push(processed);\n`;
			content += `  }\n`;
			content += `  return result;\n`;
			content += `}\n\n`;
			content += `// Usage example\n`;
			content += `const data = [1, 2, 3, 4, 5];\n`;
			content += `const output = processData${section}(data);\n`;
			content += `console.log("Section ${section} output:", output);\n`;
			content += "```\n\n";
		}

		// Add a table every 10 sections
		if (section % 10 === 0) {
			content += `### Comparison Table ${section / 10}\n\n`;
			content += `| Feature | Description | Pros | Cons |\n`;
			content += `|---------|-------------|------|------|\n`;
			for (let row = 1; row <= 8; row++) {
				content += `| Feature ${row} | Description of feature ${row} related to ${topic} | Advantage ${row} for post ${index} | Limitation ${row} to consider |\n`;
			}
			content += `\n`;
		}

		// Add a subsection with more detailed content
		content += `### Deep Dive: ${topic} Technical Details (Section ${section})\n\n`;
		content += loremParagraphs[section % loremParagraphs.length] + ` `;
		content += `When working with ${topic}, it's crucial to understand these fundamental principles. `;
		content += `In blog post ${index}, we're exploring section ${section} which covers advanced concepts. `;
		content += loremParagraphs[(section + 1) % loremParagraphs.length] + `\n\n`;
	}

	// Add conclusion
	content += `## Comprehensive Conclusion\n\n`;
	content += `This comprehensive guide on ${topic} (Blog Post ${index}) has covered 10 major sections, each exploring different facets of the topic. `;
	content += `We've examined theoretical foundations, practical implementations, code examples, and comparative analyses. `;
	content += loremParagraphs[0] + ` `;
	content += `\n\n`;
	
	content += `### Key Takeaways\n\n`;
	for (let i = 1; i <= 15; i++) {
		content += `${i}. ${loremParagraphs[i % loremParagraphs.length].substring(0, 80)}...\n`;
	}
	content += `\n`;

	content += `### Further Reading\n\n`;
	content += `For more information about ${topic}, please refer to the following resources:\n\n`;
	for (let i = 1; i <= 10; i++) {
		content += `- Resource ${i}: Advanced ${topic} Techniques - ${loremParagraphs[i % loremParagraphs.length].substring(0, 60)}...\n`;
	}
	content += `\n`;

	content += `### About the Author\n\n`;
	content += `${authors[index % authors.length]} is an expert in ${topic} with over 15 years of experience. `;
	content += loremParagraphs[index % loremParagraphs.length] + `\n\n`;

	content += `Thank you for reading this comprehensive guide on ${topic}! This was blog post ${index} in our series.\n`;

	return content;
}

export function generateFullBlog(index: number) {
	return {
		...generateBlogMetadata(index),
		content: generateBlogContent(index),
	};
}
