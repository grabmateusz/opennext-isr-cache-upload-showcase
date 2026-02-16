'use client';

import { Title, Text, Card, Group, Badge, Stack, Button, Loader, Center } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

interface BlogListProps {
	initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
	const [posts, setPosts] = useState<Post[]>(initialPosts);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const loadPage = async (page: number) => {
		if (page === 0) {
			// First page is already SSR'd
			setPosts(initialPosts);
			setCurrentPage(0);
			return;
		}

		// Pages 2+ are client-side only
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs?page=${page}`);
			if (!res.ok) {
				throw new Error("Failed to fetch posts");
			}
			const data: { blogs: Post[] } = await res.json();
			setPosts(data.blogs);
			setCurrentPage(page);
			setHasMore(data.blogs.length > 0);
		} catch (error) {
			console.error("Error loading posts:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack gap="xl">
			<div>
				<Title order={1} mb="md">
					Blog Posts
				</Title>
				<Text c="dimmed">
					{currentPage === 0 
						? `Displaying ${posts.length} posts with Server-Side Rendering (ISR)`
						: `Displaying ${posts.length} posts - Page ${currentPage + 1} (Client-Side Rendered)`
					}
				</Text>
			</div>

			{loading ? (
				<Center py="xl">
					<Loader size="lg" />
				</Center>
			) : (
				<Stack gap="md">
					{posts.map((post) => (
						<Card key={post.slug} shadow="sm" padding="lg" radius="md" withBorder>
							{post.image && (
								<div style={{ marginBottom: "1rem", position: "relative", width: "100%", height: "300px" }}>
									<Image
										src={post.image}
										alt={post.title}
										fill
										style={{ objectFit: "cover", borderRadius: "8px" }}
										unoptimized
									/>
								</div>
							)}

							<Group justify="space-between" mb="xs" mt={post.image ? "md" : undefined}>
								<Text fw={500} size="lg">
									{post.title}
								</Text>
								<Badge color="blue" variant="light">
									{post.slug}
								</Badge>
							</Group>

							<Text size="sm" c="dimmed" mb="md">
								by {post.author}
							</Text>

							{post.excerpt && (
								<Text size="sm" mb="md" lineClamp={3}>
									{post.excerpt}
								</Text>
							)}

							<Group>
								<Link href={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
									<Text size="sm" c="blue" style={{ cursor: "pointer" }}>
										Read more →
									</Text>
								</Link>
							</Group>
						</Card>
					))}
				</Stack>
			)}

			<Group justify="center" mt="xl">
				<Button
					variant="default"
					onClick={() => loadPage(currentPage - 1)}
					disabled={currentPage === 0 || loading}
				>
					Previous
				</Button>
				<Text size="sm" c="dimmed">
					Page {currentPage + 1}
				</Text>
				<Button
					variant="default"
					onClick={() => loadPage(currentPage + 1)}
					disabled={loading || !hasMore}
				>
					Next
				</Button>
			</Group>
		</Stack>
	);
}
