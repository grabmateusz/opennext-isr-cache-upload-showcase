import { Container } from "@mantine/core";
import BlogList from "./BlogList";

interface Post {
	title: string;
	slug: string;
	author: string;
	published: boolean;
	created_at: string;
	updated_at: string;
	image?: string;
	excerpt?: string;
}

// Route-level ISR: revalidate every 360 seconds
export const revalidate = 360;

// Server component - runs on server, provides SSR with ISR for first page only
export default async function Home() {
	// Fetch first page with ISR revalidation (360 seconds)
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs?page=0`, {
		next: { revalidate: 360 },
	});

	let initialPosts: Post[] = [];
	if (res.ok) {
		const data: { blogs: Post[] } = await res.json();
		initialPosts = data.blogs;
	}

	return (
		<Container size="lg" py="xl">
			<BlogList initialPosts={initialPosts} />
		</Container>
	);
}
